import { $, echo, fs, glob, minimist, os, path, tmpdir } from 'zx';
import firedragon from './package.json' with { type: 'json' };


/* CONFIG */

$.verbose = true;

const appName = 'firedragon';
const appBasename = 'FireDragon';
const repoUrl = firedragon.repository.url.replace(/\.git$/, '');
const sourceDir = 'browser/firedragon';
const version = firedragon.version;
const firefoxVersion = firedragon.firefox.version;
const objDir = 'obj';
const editions = {
    dr460nized: {
        basename: 'firedragon',
        mozconfig: `${sourceDir}/mozconfig/edition/firedragon-dr460nized.mozconfig`,
        displayName: 'Dr460nized',
    },
    catppuccin: {
        basename: 'firedragon-catppuccin',
        mozconfig: `${sourceDir}/mozconfig/edition/firedragon-catppuccin.mozconfig`,
        displayName: 'Catppuccin',
    },
};
const targets = {
    'darwin-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/darwin-arm64.mozconfig`,
        suffix: 'darwin-arm64',
        artifacts: {
            publish: ['dmg', 'update_framework_artifacts.zip'],
            dev: ['dmg', 'update_framework_artifacts.zip'],
        },
        packageDir: `${appName}/${appBasename}.app`,
        resourcesDir: `${appName}/${appBasename}.app/Contents/Resources`,
        binFile: appName,
        displayName: 'MacOS arm64',
    },
    'darwin-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/darwin-x64.mozconfig`,
        suffix: 'darwin-x64',
        artifacts: {
            publish: ['dmg', 'update_framework_artifacts.zip'],
            dev: ['dmg', 'update_framework_artifacts.zip'],
        },
        packageDir: `${appName}/${appBasename}.app`,
        resourcesDir: `${appName}/${appBasename}.app/Contents/Resources`,
        binFile: appName,
        displayName: 'MacOS x64',
    },
    'linux-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/linux-arm64.mozconfig`,
        suffix: 'linux-arm64',
        artifacts: {
            publish: ['tar.xz'],
            dev: ['tar.xz'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: appName,
        displayName: 'Linux arm64',
    },
    'linux-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/linux-x64.mozconfig`,
        suffix: 'linux-x64',
        artifacts: {
            publish: ['tar.xz'],
            dev: ['tar.xz'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: appName,
        displayName: 'Linux x64',
    },
    'win32-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/win32-arm64.mozconfig`,
        suffix: 'win32-arm64',
        artifacts: {
            publish: ['zip', 'installer.exe'],
            dev: ['zip'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: `${appName}.exe`,
        displayName: 'Windows arm64',
    },
    'win32-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/win32-x64.mozconfig`,
        suffix: 'win32-x64',
        artifacts: {
            publish: ['zip', 'installer.exe'],
            dev: ['zip'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: `${appName}.exe`,
        displayName: 'Windows x64',
    },
};

const argv = minimist(process.argv.slice(2), {
    string: ['edition', 'target'],
});

if (argv.edition && !(argv.edition in editions)) {
    throw `Unknown edition: ${argv.edition}`;
}
const edition = editions[(argv.edition ?? 'dr460nized') as keyof typeof editions];

if (argv.target && !(argv.target in targets)) {
    throw `Unknown target: ${argv.target}`;
}
const target = targets[(argv.target ?? `${os.platform()}-${os.arch()}`) as keyof typeof targets];

const versionSuffix = `-v${version}`;
const basename = `${edition.basename}${versionSuffix}`;
const sourceBasename = appName;
const sourceSuffix = 'source.tar.zst';

const cacheDir = '.cache';
const distDir = '.dist';

// buildDir & profileDir are only used for dev builds
const buildDir = '.build';
const profileDir = '.profile';

const userPrefs = {
    'devtools.debugger.prompt-connection': false,
    'devtools.debugger.remote-enabled': true,
    'devtools.chrome.enabled': true,
    'browser.newtabpage.enabled': true,
};

const tmpDir = tmpdir();
process.on('exit', () => {
    $.sync`rm -rf ${tmpDir}`;
});

/* SHARED FUNCTIONS */

async function sourceMozconfig(buildDir: string, ...mozconfigs: string[]) {
    for (const mozconfig of mozconfigs) {
        await $`echo -e '. "$topsrcdir/'${mozconfig}'"' >> ${buildDir}/mozconfig`;
    }
}

async function acAddOptions(buildDir: string, ...options: string[]) {
    for (const option of options) {
        await $`echo -e 'ac_add_options '${option} >> ${buildDir}/mozconfig`;
    }
}

async function getArtifact(basename: string, suffix: string) {
    const artifact = `${basename}${versionSuffix}.${suffix}`;
    if (await fs.pathExists(`${distDir}/${artifact}`)) {
        return `${distDir}/${artifact}`;
    }
    if (!await fs.pathExists(`${cacheDir}/${artifact}`)) {
        await $`curl -fL ${repoUrl}/-/releases/v${firedragon.version}/downloads/${basename}.${suffix} -o ${cacheDir}/${artifact}`;
    }
    return `${cacheDir}/${artifact}`;
}

async function extractArtifactTo(artifact: string, dir: string) {
    await $`mkdir -p ${dir}`;
    await $`tar --strip-components=1 -xf ${artifact} -C ${dir}`;
}


/* COMMANDS */

async function source() {
    const buildDir = `${tmpDir}/${basename}`;

    const firefoxSource = `firefox-${firefoxVersion}.source.tar.xz`;
    if (!await fs.pathExists(`${cacheDir}/${firefoxSource}`)) {
        await $`curl -fL https://archive.mozilla.org/pub/firefox/releases/${firefoxVersion}/source/${firefoxSource} -o ${cacheDir}/${firefoxSource}`;
    }
    await extractArtifactTo(`${cacheDir}/${firefoxSource}`, buildDir);

    for (const patch of await glob('patches/**/*.patch')) {
        await $`patch -Nsp1 -d ${tmpDir}/${basename} -i ${path.resolve(patch)}`;
    }

    await $`rsync -a --exclude=/.git --filter=':- .gitignore' ./ ${buildDir}/${sourceDir}/`;

    await $`echo -e ${version} > ${buildDir}/browser/config/version_display.txt`;

    await $`tar --zstd -cf ${distDir}/${sourceBasename}${versionSuffix}.${sourceSuffix} -C ${tmpDir} ${basename}`;
}

async function build() {
    const buildBasename = `${basename}.${target.suffix}`;
    const buildDir = `${tmpDir}/${buildBasename}`;

    await extractArtifactTo(await getArtifact(sourceBasename, sourceSuffix), buildDir);

    await sourceMozconfig(buildDir, edition.mozconfig, target.mozconfig);
    await acAddOptions(
        buildDir,
        '--enable-bootstrap',
        `--with-firedragon-update=${repoUrl}/-/releases/permalink/latest/downloads/${buildBasename}.update.xml`,
    );

    await $`pnpm install -C ${buildDir}/${sourceDir} --frozen-lockfile`;
    await $`pnpm run -C ${buildDir}/${sourceDir} -r build`;

    await $`cd ${buildDir} && ./mach --no-interactive bootstrap --application-choice browser`;
    await $`${buildDir}/mach configure`;

    await $`${buildDir}/mach build`;

    await $`${buildDir}/mach package`;

    const objDistDir = `${buildDir}/${objDir}/dist`;
    const packageName = (await $`cat ${objDistDir}/package_name.txt`.lines())[0];
    for (const format of target.artifacts.publish) {
        switch (format) {
            case 'installer.exe':
                await $`cp ${objDistDir}/${packageName.replace(/\.zip$/, `.${format}`)} ${distDir}/${buildBasename}.${format}`;
                break;
            case 'update_framework_artifacts.zip':
                await $`cp ${objDistDir}/${packageName.replace(/\.dmg$/, `.${format}`)} ${distDir}/${buildBasename}.${format}`;
                break;
            default:
                await $`cp ${objDistDir}/${packageName} ${distDir}/${buildBasename}.${format}`;
        }
    }

    await $`MAR=${objDistDir}/host/bin/mar MOZ_PRODUCT_VERSION=${firefoxVersion} MAR_CHANNEL_ID=release ${buildDir}/tools/update-packaging/make_full_update.sh ${distDir}/${buildBasename}.mar ${objDistDir}/${target.packageDir}`;

    const [
        buildID,
        hashValue,
        size,
    ] = await Promise.all([
        (async () => (await $`awk -F '=' '/BuildID/ {print $2}' ${objDistDir}/${target.resourcesDir}/application.ini`).lines()[0])(),
        (async () => (await $`sha512sum ${distDir}/${buildBasename}.mar | cut -c 1-128`).lines()[0])(),
        (async () => (await $`stat -c '%s' ${distDir}/${buildBasename}.mar`).lines()[0])(),
    ]);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<updates>
    <update type="minor" displayVersion="${version}" appVersion="${firefoxVersion}" platformVersion="${firefoxVersion}" buildID="${buildID}" detailsURL="${repoUrl}/-/releases/v${version}">
        <patch type="complete" URL="${repoUrl}/-/releases/v${version}/downloads/${buildBasename}.mar" hashFunction="sha512" hashValue="${hashValue}" size="${size}"/>
    </update>
</updates>
`;

    await $`echo -e ${xml} > ${distDir}/${buildBasename}.update.xml`;
}

async function appimage() {
    const buildBasename = `${basename}.${target.suffix.replace('linux', 'appimage')}`;
    const buildDir = `${tmpDir}/${buildBasename}`;

    await extractArtifactTo(await getArtifact(edition.basename, `${target.suffix}.tar.xz`), buildDir);

    await $`sed 's#/usr/lib/${appName}/${appName}#${appName}#' assets/${appName}.desktop > ${buildDir}/${appName}.desktop`;
    await $`cp ${buildDir}/browser/chrome/icons/default/default128.png ${buildDir}/${appName}.png`;

    await $`cp assets/AppRun ${buildDir}/AppRun`;
    await $`chmod a+x ${buildDir}/AppRun`;

    await $`curl -L https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage -o ${tmpDir}/appimagetool-x86_64.AppImage`;
    await $`chmod a+x ${tmpDir}/appimagetool-x86_64.AppImage`;

    await $`${tmpDir}/appimagetool-x86_64.AppImage ${buildDir} ${distDir}/${buildBasename}.AppImage`;
}

async function dev() {
    const devArtifacts = await Promise.all(target.artifacts.dev.map((format) => getArtifact(edition.basename, `${target.suffix}.${format}`)));

    for (const artifact of devArtifacts) {
        const processedJar = `${artifact}.processed.jar`;
        if (await fs.pathExists(processedJar)) {
            await $`rm ${processedJar}`;
        }
    }

    const initialRun = !await fs.pathExists(buildDir);

    if (initialRun) {
        await extractArtifactTo(await getArtifact(sourceBasename, sourceSuffix), buildDir);

        await $`rm -rf ${buildDir}/${sourceDir}`;
        await $`ln -s ${path.resolve()} ${buildDir}/${sourceDir}`;
    }

    await $`pnpm run -r dev`;

    const $$ = $({
        env: {
            ...$.env,
            FIREDRAGON_ARTIFACT_BUILD: 'true',
            MOZ_ARTIFACT_FILE: devArtifacts.map((artifact) => path.resolve(artifact)).join(':'),
        },
    });

    if (initialRun) {
        await sourceMozconfig(buildDir, edition.mozconfig, target.mozconfig);
        await acAddOptions(buildDir, '--enable-bootstrap', '--enable-artifact-builds');

        await $$`cd ${buildDir} && ./mach --no-interactive bootstrap --application-choice browser_artifact_mode`;
        await $$`${buildDir}/mach configure`
    }

    await $$`${buildDir}/mach build`;

    await $`mkdir -p ${profileDir}`;
    await $`echo -e ${Object.entries(userPrefs).map(([key, value]) => `user_pref(${JSON.stringify(key)}, ${JSON.stringify(value)});`).join('\n')} > ${profileDir}/user.js`;

    await $`${buildDir}/${objDir}/dist/bin/${target.binFile} --profile ${profileDir} --jsdebugger --wait-for-jsdebugger --remote-debugging-port`;
}

async function clobber() {
    await $`rm -rf ${buildDir} ${profileDir}`;
}

async function release() {
    if (await $`git tag -l v${version}`.text()) {
        echo(`Tag v${version} already exists`);
        process.exit(1);
    }

    await $`git-cliff -c assets/cliff.changelog.toml -u -t v${version} -p CHANGELOG.md`;

    const date = new Date();
    const release = {
        '@version': `v${version}`,
        '@date': `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
        url: {
            '@type': 'details',
            '#text': `${repoUrl}/-/releases/v${version}`,
        },
        description: null,
    };

    await $`xq --xml-dtd --argjson release ${JSON.stringify(release)} '.component.releases.release = [$release] + .component.releases.release' -x -i assets/org.garudalinux.firedragon.metainfo.xml`;
    await $`xq --xml-dtd --argjson release ${JSON.stringify(release)} '.component.releases.release = [$release] + .component.releases.release' -x -i assets/org.garudalinux.firedragon-catppuccin.metainfo.xml`;

    await $`git add package.json CHANGELOG.md assets/org.garudalinux.firedragon.metainfo.xml assets/org.garudalinux.firedragon-catppuccin.metainfo.xml`;
    await $`git commit -m 'release: v'${version}`;
    await $`git tag -m v${version} v${version}`
}


/* ENTRYPOINT */

await $`mkdir -p ${cacheDir} ${distDir}`;

for (const command of argv._) {
    switch (command) {
        case 'source':
            await source();
            break;
        case 'build':
            await build();
            break;
        case 'dev':
            await dev();
            break;
        case 'clobber':
            await clobber();
            break;
        case 'appimage':
            await appimage();
            break;
        case 'release':
            await release();
            break;
        default:
            throw `Unknown command: ${command}`;
    }
}
