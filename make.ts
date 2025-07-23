/// <reference types="zx/globals" />

import { access } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import process from 'node:process';
import { js2xml } from "npm:xml-js";
import packageJson from './package.json' with { type: 'json' };

async function exists(path: string): Promise<boolean> {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function applyPatches(target: string, ...patches: string[]): Promise<void> {
    for (const patch of await glob(patches)) {
        await $`patch -Nsp1 -d ${target} -i ${resolve(patch)}`;
    }
}

function parseArgv(argv: string[]) {
    return minimist(argv, {
        boolean: ['enable-bootstrap', 'enable-update', 'enable-artifact-build'],
        string: ['dist-dir', 'cache-dir', 'edition', 'target', 'with-buildid2', 'with-moz-build-date', 'with-dist', 'with-mozconfig', 'save-dist-host-bin', 'with-dist-host-bin'],
        unknown(arg) {
            if (arg.startsWith('-')) {
                throw `Unknown arguments: ${arg}`
            }
            return true;
        },
        '--': true,
    });
}

async function sourceMozconfigs(buildDir: string, ...mozconfigs: string[]) {
    for (const mozconfig of mozconfigs) {
        const path = isAbsolute(mozconfig) ? mozconfig : `$topsrcdir/${mozconfig}`;
        await $`echo -e '. "'${path}'"' >> ${buildDir}/mozconfig`;
    }
}

async function acAddOptions(buildDir: string, ...options: string[]) {
    for (const option of options) {
        await $`echo -e 'ac_add_options '${option} >> ${buildDir}/mozconfig`;
    }
}

interface Config {
    appName: string;
    appBasename: string;
    repoUrl: string;
    sourcePath: string;
    version: string;
    runtime: string;
    tmpDir: string;
    distDir: string;
    cacheDir: string;
    sourceBasename: string;
    edition: (typeof EDITIONS)[keyof typeof EDITIONS];
    basename: string;
    basenameRuntime: string;
    target: (typeof TARGETS)[keyof typeof TARGETS];
    enableBootstrap: boolean;
    enableUpdate: boolean;
    enableArtifactBuild: boolean;
    withMozBuildDate: string | null;
    withBuildID2: string | null;
    withDist: string | null;
    withMozconfig: string | null;
    saveDistHostBin: string | null;
    withDistHostBin: string | null;
}

async function getFloorpRuntime(config: Config): Promise<string> {
    const { runtime, cacheDir } = config;

    const response = await fetch(`https://api.github.com/repos/Floorp-Projects/Floorp-runtime/releases/${runtime}`);
    if (!response.ok) {
        throw `Invalid runtime release: ${runtime}`;
    }

    const release: {
        tag_name: string,
        tarball_url: string,
    } = await response.json() as any;

    const tarball = `${cacheDir}/floorp-runtime-${release.tag_name}.tar.gz`;

    if (!await exists(tarball)) {
        await $`curl -fL ${release.tarball_url} -o ${tarball}`
    }

    return tarball;
}

async function getFiredragonRuntime(config: Config): Promise<string> {
    const { repoUrl, distDir, cacheDir, basenameRuntime, target } = config;

    const filename = `${basenameRuntime}-${target.buildSuffix}.${target.buildRuntimeOutputFormat}`;

    if (await exists(`${distDir}/${filename}`)) {
        return `${distDir}/${filename}`;
    }

    if (!await exists(`${cacheDir}/${filename}`)) {
        await $`curl -fL ${repoUrl}/-/releases/permalink/latest/downloads/${filename} -o ${cacheDir}/${filename}`;
    }

    return `${cacheDir}/${filename}`;
}

async function prepareSource(config: Config, dir: string): Promise<void> {
    const { sourcePath, version } = config;

    // Extract floorp runtime and inject this repo
    const runtimeTarball = await getFloorpRuntime(config);
    await $`mkdir ${dir}`;
    await $`tar -xf ${runtimeTarball} --strip-components=1 -C ${dir}`;
    await $`rm -d ${dir}/floorp`;
    await $`rsync -a --exclude=/.git --filter=':- .gitignore' ./ ${dir}/${sourcePath}/`;

    // Copy branding
    await $`cp -r gecko/branding/* ${dir}/browser/branding/`;

    // Set display version
    await $`echo -e ${version} > ${dir}/browser/config/version_display.txt`;

    await applyPatches(dir, `patches/**/*.patch`);
}

async function extractSource(config: Config, buildDir: string): Promise<void> {
    const { distDir, sourceBasename } = config;

    const sourceTarball = `${distDir}/${sourceBasename}.tar.zst`;
    if (!await exists(sourceTarball)) {
        await source(config);
    }

    // Extract source
    await $`mkdir ${buildDir}`;
    await $`tar -xf ${sourceTarball} --strip-components=1 -C ${buildDir}`;
}

async function prepareBuild(config: Config, buildDir: string) {
    const { sourcePath, edition, target, withBuildID2, withMozconfig } = config;

    // Install deno dependencies
    await $`cd ${buildDir}/${sourcePath} && deno install --allow-scripts --frozen`;

    // Ensure buildid2 exists
    if (withBuildID2) {
        await $`mkdir -p ${buildDir}/${sourcePath}/_dist`;
        await $`cat ${withBuildID2} > ${buildDir}/${sourcePath}/_dist/buildid2`;
    } else if (!await exists(`${buildDir}/${sourcePath}/_dist/buildid2`)) {
        await $`cd ${buildDir}/${sourcePath} && deno task build --write-buildid2`;
    }

    // Combine mozconfigs
    await sourceMozconfigs(buildDir, edition.mozconfig, target.mozconfig);
    if (withMozconfig) {
        await sourceMozconfigs(buildDir, resolve(withMozconfig))
    }
}

async function doBuild(config: Config, buildDir: string) {
    const { enableBootstrap, enableArtifactBuild, withMozBuildDate } = config;

    // Potentially set MOZ_BUILD_DATE
    if (withMozBuildDate) {
        const moz_build_date = (await Deno.readTextFile(withMozBuildDate)).trim();
        Deno.env.set('MOZ_BUILD_DATE', moz_build_date);
    }

    // Potentially run bootstrap
    if (enableBootstrap) {
        await $`cd ${buildDir} && ./mach --no-interactive bootstrap --application-choice ${enableArtifactBuild ? 'browser_artifact_mode' : 'browser'}`;
        await acAddOptions(buildDir, '--enable-bootstrap');
    } else {
        await acAddOptions(buildDir, '--disable-bootstrap');
    }

    // Run configure
    await $`${buildDir}/mach configure`;

    // Run build
    await $`${buildDir}/mach build`;
}

function getCommonBuildDirs(config: Config, buildDir: string): { objDistDir: string, objDistBinDir: string } {
    const { target } = config;

    const objDistDir = `${buildDir}/obj-artifact-build-output/dist`;
    const objDistBinDir = `${objDistDir}/${target.objDistBinPath}`;

    return {
        objDistDir,
        objDistBinDir,
    };
}

async function cloneObjDistBin(config: Config, buildDir: string) {
    const { objDistBinDir } = getCommonBuildDirs(config, buildDir);

    // Resolve symlinks (https://www.spinics.net/lists/git/msg391750.html)
    const objDistBinTmpDir = tmpdir();
    await $`rsync -aL ${objDistBinDir}/ ${objDistBinTmpDir}/`;
    await $`rm -rf ${objDistBinDir}`;
    await $`mv ${objDistBinTmpDir} ${objDistBinDir}`;
}

async function packageBuild(config: Config, outputFormat: string, buildBasename: string, buildDir: string) {
    const { distDir, saveDistHostBin } = config;

    const { objDistDir, objDistBinDir } = getCommonBuildDirs(config, buildDir);

    // Remove references to the build directory
    for (const file of await $`rg -Fl ${buildDir} ${objDistBinDir}`.nothrow().lines()) {
        await $`sed -i 's#${buildDir}##g' ${file}`;
    }

    // Run package
    await $`${buildDir}/mach package`;

    // Move package to dist dir
    let packageName = (await $`cat ${objDistDir}/package_name.txt`.lines())[0];
    if (outputFormat === 'exe') {
        packageName = packageName.replace(/.zip$/, '.installer.exe');
    }
    await $`mv ${objDistDir}/${packageName} ${distDir}/${buildBasename}.${outputFormat}`;

    // Save dist/host/bin
    if (saveDistHostBin) {
        await $`tar --zstd -cf ${saveDistHostBin} -C ${objDistDir} host/bin`;
    }
}

function getUpdateUrls(config: Config) {
    const { repoUrl, version, edition, target } = config;

    return {
        updateXml: `${repoUrl}/-/releases/permalink/latest/downloads/${edition.basename}-${target.buildSuffix}.update.xml`,
        mar: `${repoUrl}/-/releases/v${version}/downloads/${edition.basename}-${target.buildSuffix}.mar`,
        details: `${repoUrl}/-/releases/v${version}`,
    };
}

async function createUpdate(config: Config, buildBasename: string, buildDir: string) {
    const { version, distDir, target, withDistHostBin } = config;

    const { objDistDir, objDistBinDir } = getCommonBuildDirs(config, buildDir);

    // Use provided dist/host/bin
    if (withDistHostBin) {
        await $`tar -xf ${withDistHostBin} -C ${objDistDir}`;
    }

    const appVersion = (await $`cat ${buildDir}/browser/config/version.txt`).lines()[0];

    await $`MAR=${objDistDir}/host/bin/mar MOZ_PRODUCT_VERSION=${appVersion} MAR_CHANNEL_ID=release ${buildDir}/tools/update-packaging/make_full_update.sh ${distDir}/${buildBasename}.mar ${objDistDir}/${target.updatePath}`;

    const [
        buildID,
        buildID2,
        hashValue,
        size,
    ] = await Promise.all([
        (async () => (await $`awk -F '=' '/BuildID/ {print $2}' ${objDistBinDir}/application.ini`).lines()[0])(),
        (async () => (await $`cat ${objDistBinDir}/browser/buildid2`).lines()[0])(),
        (async () => (await $`sha512sum ${distDir}/${buildBasename}.mar | cut -c 1-128`).lines()[0])(),
        (async () => (await $`stat -c '%s' ${distDir}/${buildBasename}.mar`).lines()[0])(),
    ]);

    const { mar, details } = getUpdateUrls(config);

    const update = {
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "UTF-8",
            },
        },
        updates: {
            update: {
                _attributes: {
                    type: 'minor',
                    displayVersion: version,
                    appVersion: appVersion,
                    platformVersion: appVersion,
                    buildID: buildID,
                    appVersion2: version,
                    buildID2: buildID2,
                    detailsURL: details,
                },
                patch: [
                    {
                        _attributes: {
                            type: "complete",
                            URL: mar,
                            hashFunction: 'sha512',
                            hashValue: hashValue,
                            size: size,
                        },
                    },
                ],
            },
        },
    };

    await $`echo -e ${js2xml(update, { compact: true, spaces: 4 })} > ${distDir}/${buildBasename}.update.xml`;
}

async function source(config: Config) {
    const { tmpDir, distDir, sourceBasename } = config;

    await prepareSource(config, `${tmpDir}/${sourceBasename}`);

    await $`tar --zstd -cf ${distDir}/${sourceBasename}.tar.zst -C ${tmpDir} ${sourceBasename}`;
}

async function buildRuntime(config: Config) {
    const { tmpDir, basenameRuntime, target } = config;

    const buildDevBasename = `${basenameRuntime}-${target.buildSuffix}`
    const buildDevDir = `${tmpDir}/${buildDevBasename}`;

    await extractSource(config, buildDevDir);

    await prepareBuild(config, buildDevDir);

    await acAddOptions(buildDevDir, '--enable-chrome-format=flat', `--enable-firedragon-debug`);

    await doBuild(config, buildDevDir);

    await cloneObjDistBin(config, buildDevDir);

    await packageBuild(config, target.buildRuntimeOutputFormat, buildDevBasename, buildDevDir);
}

async function build(config: Config) {
    const { sourcePath, tmpDir, basename, target, enableUpdate, enableArtifactBuild, withDist } = config;

    const buildBasename = `${basename}-${target.buildSuffix}`;
    const buildDir = `${tmpDir}/${buildBasename}`

    await extractSource(config, buildDir);

    await prepareBuild(config, buildDir);

    // Use provided dist or run release build before
    if (withDist) {
        await $`cp -r ${withDist}/noraneko ${buildDir}/${sourcePath}/_dist/noraneko`;
    } else {
        await $`cd ${buildDir}/${sourcePath} && NODE_ENV=production deno task build --release-build-before`;
    }

    // Set noraneko dist
    await acAddOptions(buildDir, `--with-noraneko-dist=${sourcePath}/_dist/noraneko`, '--enable-firedragon-settings');

    if (enableUpdate) {
        await acAddOptions(buildDir, `--with-firedragon-update=${getUpdateUrls(config).updateXml}`);
    } else {
        await acAddOptions(buildDir, '--disable-updater');
    }

    if (enableArtifactBuild) {
        await acAddOptions(buildDir, '--enable-artifact-builds');
        Deno.env.set('MOZ_ARTIFACT_FILE', resolve(await getFiredragonRuntime(config)));

        // Remove mozconfig lines tagged with #[NotOnArtifactBuild]
        for (const file of await $`rg -Fl '#[NotOnArtifactBuild]' ${buildDir}/${sourcePath}/gecko/mozconfigs`.nothrow().lines()) {
            await $`sed -i '/#\\[NotOnArtifactBuild\\]/d' ${file}`;
        }
    }

    await doBuild(config, buildDir);

    // Run release build after
    await $`cd ${buildDir}/${sourcePath} && deno task build --release-build-after`;

    await packageBuild(config, target.buildOutputFormat, buildBasename, buildDir);

    if (enableUpdate) {
        await createUpdate(config, buildBasename, buildDir);
    }
}

async function appimage(config: Config) {
    const { appName, tmpDir, distDir, basename, target } = config;

    if (!target.appimageSuffix) {
        throw `Target does not support appimage build.`;
    }

    const appimageBasename = `${basename}-${target.appimageSuffix}`;
    const appimageDir = `${tmpDir}/${appimageBasename}`;

    const buildTarball = `${distDir}/${basename}-${target.buildSuffix}.${target.buildOutputFormat}`;
    if (!await exists(buildTarball)) {
        await build(config);
    }

    // Extract binary tarball
    await $`mkdir ${appimageDir}`;
    await $`tar -xf ${buildTarball} --strip-components=1 -C ${appimageDir}`;

    // Copy desktop and logo
    await $`sed 's#/usr/lib/${appName}/${appName}#${appName}#' assets/${appName}.desktop > ${appimageDir}/${appName}.desktop`;
    await $`cp ${appimageDir}/browser/chrome/icons/default/default128.png ${appimageDir}/${appName}.png`;

    // Copy AppRun and make executable
    await $`cp assets/AppRun ${appimageDir}/AppRun`;
    await $`chmod a+x ${appimageDir}/AppRun`;

    // Download appimagetool and make executable
    await $`curl -L https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage -o ${tmpDir}/appimagetool-x86_64.AppImage`;
    await $`chmod a+x ${tmpDir}/appimagetool-x86_64.AppImage`;

    // Make AppImage
    await $`${tmpDir}/appimagetool-x86_64.AppImage ${appimageDir} ${distDir}/${appimageBasename}.AppImage`;
}

const APP_NAME = 'firedragon';
const APP_BASENAME = 'FireDragon';
const REPO_URL = 'https://gitlab.com/garuda-linux/firedragon/firedragon12';
const SOURCE_PATH = 'firedragon';
const EDITIONS = {
    dr460nized: {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/edition/firedragon-dr460nized.mozconfig`,
        branding: 'firedragon',
        basename: APP_NAME,
    },
    catppuccin: {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/edition/firedragon-catppuccin.mozconfig`,
        branding: 'firedragon-catppuccin',
        basename: `${APP_NAME}-catppuccin`,
    },
};
const TARGETS = {
    'linux-x64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/linux-x64.mozconfig`,
        objDistBinPath: 'bin',
        buildSuffix: 'linux-x64',
        buildOutputFormat: 'tar.xz',
        buildRuntimeOutputFormat: 'tar.xz',
        appimageSuffix: 'appimage-x64',
        updatePath: APP_NAME,
    },
    'linux-arm64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/linux-arm64.mozconfig`,
        objDistBinPath: 'bin',
        buildSuffix: 'linux-arm64',
        buildOutputFormat: 'tar.xz',
        buildRuntimeOutputFormat: 'tar.xz',
        appimageSuffix: 'appimage-arm64',
        updatePath: APP_NAME,
    },
    'win32-x64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/win32-x64.mozconfig`,
        objDistBinPath: 'bin',
        buildSuffix: 'win32-x64',
        buildOutputFormat: 'exe',
        buildRuntimeOutputFormat: 'zip',
        appimageSuffix: null,
        updatePath: APP_NAME,
    },
    'win32-arm64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/win32-arm64.mozconfig`,
        objDistBinPath: 'bin',
        buildSuffix: 'win32-arm64',
        buildOutputFormat: 'exe',
        buildRuntimeOutputFormat: 'zip',
        appimageSuffix: null,
        updatePath: APP_NAME,
    },
    'darwin-x64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/darwin-x64.mozconfig`,
        objDistBinPath: `${APP_BASENAME}.app/Contents/Resources`,
        buildSuffix: 'darwin-x64',
        buildOutputFormat: 'dmg',
        buildRuntimeOutputFormat: 'dmg',
        appimageSuffix: null,
        updatePath: `${APP_NAME}/${APP_BASENAME}.app`,
    },
    'darwin-arm64': {
        mozconfig: `${SOURCE_PATH}/gecko/mozconfigs/target/darwin-arm64.mozconfig`,
        objDistBinPath: `${APP_BASENAME}.app/Contents/Resources`,
        buildSuffix: 'darwin-arm64',
        buildOutputFormat: 'dmg',
        buildRuntimeOutputFormat: 'dmg',
        appimageSuffix: null,
        updatePath: `${APP_NAME}/${APP_BASENAME}.app`,
    },
};

let tmpDir;
try {
    tmpDir = tmpdir();
    echo(`Using temporary directory: ${tmpDir}`);

    await $`mkdir -p ${tmpDir}`;

    let argv = parseArgv(process.argv.slice(4));
    while (true) {
        const distDir = argv['dist-dir'] ?? '.dist';
        if (!await exists(distDir)) {
            await $`mkdir -p ${distDir}`;
        }

        const cacheDir = argv['cache-dir'] ?? '.cache';
        if (!await exists(cacheDir)) {
            await $`mkdir -p ${cacheDir}`;
        }

        const edition = EDITIONS[(argv['edition'] ?? 'dr460nized') as keyof typeof EDITIONS];
        if (!edition) {
            throw `Unsupported edition ${argv['edition']}, must be one of [${Object.keys(EDITIONS).join(', ')}].`;
        }

        const target = TARGETS[(argv['target'] ?? `${process.platform}-${process.arch}`) as keyof typeof TARGETS];
        if (!target){
            throw `Unsupported target ${argv['target']}, must be one of [${Object.keys(TARGETS).join(', ')}].`;
        }

        const { version } = packageJson;
        const sourceBasename = `${APP_NAME}-source-v${version}`;
        const basename = `${edition.basename}-v${version}`;
        const basenameRuntime = `${edition.basename}-runtime-v${version}`;

        const config: Config = {
            appName: APP_NAME,
            appBasename: APP_BASENAME,
            repoUrl: REPO_URL,
            sourcePath: SOURCE_PATH,
            version,
            runtime: argv.runtime ?? packageJson.runtime,
            tmpDir,
            distDir,
            cacheDir,
            sourceBasename,
            edition,
            basename,
            basenameRuntime,
            target,
            enableBootstrap: argv['enable-bootstrap'] ?? false,
            enableUpdate: argv['enable-update'] ?? false,
            enableArtifactBuild: argv['enable-artifact-build'] ?? false,
            withMozBuildDate: argv['with-moz-build-date'] ?? null,
            withBuildID2: argv['with-buildid2'] ?? null,
            withDist: argv['with-dist'] ?? null,
            withMozconfig: argv['with-mozconfig'] ?? null,
            saveDistHostBin: argv['save-dist-host-bin'] ?? null,
            withDistHostBin: argv['with-dist-host-bin'] ?? null,
        };

        for (const command of argv._) {
            switch (command) {
                case 'source':
                    await source(config);
                    break;
                case 'build-runtime':
                    await buildRuntime(config);
                    break;
                case 'build':
                    await build(config);
                    break;
                case 'appimage':
                    await appimage(config);
                    break;
                default:
                    throw `Unsupported command ${command}, must be one of [source, build-runtime, build, appimage]`;
            }
        }

        if (!argv['--']?.length) {
            break;
        }
        argv = parseArgv(argv['--']);
    }
} finally {
    await $`rm -rf ${tmpDir}`;
}
