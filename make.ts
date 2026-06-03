import { $, echo, fs, glob, minimist, path, sleep, tmpdir } from 'zx';

import {
    appName,
    buildDir,
    cacheDir,
    defaultEdition,
    defaultTarget,
    distDir,
    editions,
    firefoxVersion,
    objDir,
    profileDir,
    repoUrl,
    sourceDir,
    targets,
    userPrefs,
    version,
} from './config';

/* CONFIG */

$.verbose = true;

const argv = minimist(process.argv.slice(2), {
    '--': true,
    string: ['edition', 'target'],
});

const editionKey = argv.edition ?? defaultEdition;
if (!(editionKey in editions)) {
    throw `Unknown edition: ${editionKey}`;
}
const edition = editions[editionKey as keyof typeof editions];

const targetKey = argv.target ?? defaultTarget;
if (!(targetKey in targets)) {
    throw `Unknown target: ${targetKey}`;
}
const target = targets[targetKey as keyof typeof targets];

const versionSuffix = `-v${version}`;
const basename = `${edition.basename}${versionSuffix}`;
const sourceBasename = appName;
const sourceSuffix = 'source.tar.xz';

const tmpDir = tmpdir();
process.on('exit', () => {
    $.sync`rm -rf ${tmpDir}`;
});

$.env.FIREDRAGON_EDITION = editionKey;
$.env.FIREDRAGON_TARGET = targetKey;

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
    if (!(await fs.pathExists(`${cacheDir}/${artifact}`))) {
        await $`curl -fL ${repoUrl}/-/releases/v${version}/downloads/${basename}.${suffix} -o ${tmpDir}/${artifact}`;
        await $`mv ${tmpDir}/${artifact} ${cacheDir}/${artifact}`;
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
    if (!(await fs.pathExists(`${cacheDir}/${firefoxSource}`))) {
        await $`curl -fL https://archive.mozilla.org/pub/firefox/releases/${firefoxVersion}/source/${firefoxSource} -o ${tmpDir}/${firefoxSource}`;
        await $`mv ${tmpDir}/${firefoxSource} ${cacheDir}/${firefoxSource}`;
    }
    await extractArtifactTo(`${cacheDir}/${firefoxSource}`, buildDir);

    for (const patch of await glob('patches/**/*.patch')) {
        await $`patch -Nsp1 -d ${tmpDir}/${basename} -i ${path.resolve(patch)}`;
    }

    await $`rsync -a --exclude=/.git --filter=':- .gitignore' ./ ${buildDir}/${sourceDir}/`;

    await $`echo -e ${version} > ${buildDir}/browser/config/version_display.txt`;

    const l10nDir = `${buildDir}/${sourceDir}/l10n`,
        locales = await $({ verbose: false })`cat ${buildDir}/browser/locales/l10n-changesets.json`.json();
    for (const [locale, { revision }] of Object.entries(locales) as [string, { revision: string }][]) {
        if (!(await fs.pathExists(`${cacheDir}/firefox-l10n-${revision}.tar.gz`))) {
            await $`curl -fL https://github.com/mozilla-l10n/firefox-l10n/archive/${revision}.tar.gz -o ${tmpDir}/firefox-l10n-${revision}.tar.gz`;
            await $`mv ${tmpDir}/firefox-l10n-${revision}.tar.gz ${cacheDir}/firefox-l10n-${revision}.tar.gz`;
        }

        if (!(await fs.pathExists(`${tmpDir}/firefox-l10n-${revision}`))) {
            await $`mkdir -p ${tmpDir}/firefox-l10n-${revision}`;
            await $`tar --strip-components=1 -xf ${cacheDir}/firefox-l10n-${revision}.tar.gz -C ${tmpDir}/firefox-l10n-${revision}`;
        }

        await $`mkdir -p ${l10nDir}/${locale}`;
        await $`rsync -a ${tmpDir}/firefox-l10n-${revision}/${locale}/ ${l10nDir}/${locale}/`;
    }

    for (const inc of await glob(`**/*.inc.{ftl,properties}`, { cwd: l10nDir })) {
        let source = inc.replace(/\.inc\.(ftl|properties)$/, '.$1');
        const [locale, category, ...rest] = source.split('/');
        if (locale === 'en-US') {
            source = `${buildDir}/${category}/locales/en-US/${rest.join('/')}`;
            await $`cat ${source} ${l10nDir}/${inc} | sponge ${source}`;
        } else {
            await $`cat ${l10nDir}/${source} ${l10nDir}/${inc} | sponge ${l10nDir}/${source}`;
        }
        await $`rm ${l10nDir}/${inc}`;
    }

    await $`tar -cJf ${distDir}/${sourceBasename}${versionSuffix}.${sourceSuffix} -C ${tmpDir} ${basename}`;
}

async function build() {
    const buildBasename = `${basename}.${target.suffix}`;
    const buildDir = `${tmpDir}/${buildBasename}`;

    await extractArtifactTo(await getArtifact(sourceBasename, sourceSuffix), buildDir);

    await sourceMozconfig(buildDir, edition.mozconfig, target.mozconfig);
    await acAddOptions(
        buildDir,
        '--enable-bootstrap',
        `--with-firedragon-update=${repoUrl}/-/releases/permalink/latest/downloads/${edition.basename}.${target.suffix}.update.xml`,
    );

    await $`pnpm install -C ${buildDir}/${sourceDir} --frozen-lockfile`;
    await $({ cwd: `${buildDir}/${sourceDir}` })`pnpm lerna run --stream build`;

    await $`cd ${buildDir} && ./mach --no-interactive bootstrap --application-choice browser`;
    await $`${buildDir}/mach configure`;

    await $`${buildDir}/mach build`;

    await $`cat ${buildDir}/browser/locales/shipped-locales | xargs ${buildDir}/mach package-multi-locale --locales`;

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

    const [buildID, hashValue, size] = await Promise.all([
        (async () =>
            (
                await $`awk -F '=' '/BuildID/ {print $2}' ${objDistDir}/${target.resourcesDir}/application.ini`
            ).lines()[0])(),
        (async () => (await $`sha512sum ${distDir}/${buildBasename}.mar | cut -c 1-128`).lines()[0])(),
        (async () => (await $`stat -c '%s' ${distDir}/${buildBasename}.mar`).lines()[0])(),
    ]);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<updates>
    <update type="minor" displayVersion="${version}" appVersion="${firefoxVersion}" platformVersion="${firefoxVersion}" buildID="${buildID}" detailsURL="${repoUrl}/-/releases/v${version}">
        <patch type="complete" URL="${repoUrl}/-/releases/v${version}/downloads/${edition.basename}.${target.suffix}.mar" hashFunction="sha512" hashValue="${hashValue}" size="${size}"/>
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
    const devArtifacts = await Promise.all(
        target.artifacts.dev.map((format) => getArtifact(edition.basename, `${target.suffix}.${format}`)),
    );

    for (const artifact of devArtifacts) {
        const processedJar = `${artifact}.processed.jar`;
        if (await fs.pathExists(processedJar)) {
            await $`rm ${processedJar}`;
        }
    }

    const initialRun = !(await fs.pathExists(buildDir));

    if (initialRun) {
        await extractArtifactTo(await getArtifact(sourceBasename, sourceSuffix), buildDir);

        await $`rm -rf ${buildDir}/${sourceDir}`;
        await $`ln -s ${path.relative(path.dirname(`${buildDir}/${sourceDir}`), '')} ${buildDir}/${sourceDir}`;
    }

    $`pnpm lerna run --stream dev`;
    await sleep('10s');

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
        await $$`${buildDir}/mach configure`;
    }

    await $$`${buildDir}/mach build`;

    await $`mkdir -p ${profileDir}`;
    await $`echo -e ${Object.entries(userPrefs)
        .map(([key, value]) => `user_pref(${JSON.stringify(key)}, ${JSON.stringify(value)});`)
        .join('\n')} > ${profileDir}/user.js`;

    await $`${buildDir}/${objDir}/dist/bin/${target.binFile} --profile ${profileDir} --jsdebugger --wait-for-jsdebugger --remote-debugging-port ${argv['--']}`;
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

    await $`xq --xml-dtd -x -i --argjson release ${JSON.stringify(release)} '.component.releases.release = [$release] + .component.releases.release' assets/*.metainfo.xml`;

    await $`git add package.json CHANGELOG.md assets/*.metainfo.xml`;
    await $`git commit -m 'release: v'${version}`;
    await $`git tag -m v${version} v${version}`;
}

async function ciRelease() {
    const artifacts = [
        {
            name: `${appName}-v${version}.${sourceSuffix}`,
            url: `${$.env.CI_API_V4_URL}/projects/${$.env.CI_PROJECT_ID}/packages/generic/firedragon/${version}/${appName}-v${version}.${sourceSuffix}`,
            direct_asset_path: `/${appName}.${sourceSuffix}`,
            link_type: 'package',
        },
    ];
    const downloads = [
        '| Name | Downloads |',
        '|------|-----------|',
        `| Source | [${artifacts[0].name}](${repoUrl}/-/releases/${version}/downloads${artifacts[0].direct_asset_path}) |`,
    ];
    for (const edition of Object.values(editions)) {
        for (const target of Object.values(targets)) {
            let firstArtifact = null;
            for (const format of target.artifacts.release) {
                const suffix = `${format === 'AppImage' ? target.suffix.replace('linux', 'appimage') : target.suffix}.${format}`;
                const name = `${edition.basename}-v${version}.${suffix}`;
                const artifact = {
                    name,
                    url: `${$.env.CI_API_V4_URL}/projects/${$.env.CI_PROJECT_ID}/packages/generic/firedragon/${version}/${name}`,
                    direct_asset_path: `/${edition.basename}.${suffix}`,
                    link_type: 'package',
                };
                if (!firstArtifact) {
                    firstArtifact = artifact;
                }
                artifacts.push(artifact);
            }
            if (firstArtifact) {
                downloads.push(
                    `| ${edition.displayName} ${target.displayName} | [${firstArtifact.name}](${repoUrl}/-/releases/v${version}/downloads${firstArtifact.direct_asset_path}) |`,
                );
                if (target.suffix.includes('linux')) {
                    downloads.push(
                        `| ${edition.displayName} ${target.displayName.replace('Linux', 'AppImage')} | [${firstArtifact.name.replace('linux', 'appimage').replace('tar.xz', 'AppImage')}](${repoUrl}/-/releases/v${version}/downloads${firstArtifact.direct_asset_path.replace('linux', 'appimage').replace('tar.xz', 'AppImage')}) |`,
                    );
                }
            }
        }
    }

    for (const artifact of artifacts) {
        await $`curl --header 'JOB-TOKEN: '${$.env.CI_JOB_TOKEN} --upload-file '.dist/'${artifact.name} ${artifact.url}`;
    }

    const technicalInformation = `Firefox: ${firefoxVersion}`;
    const description = (await $`git-cliff -c assets/cliff.release.toml --latest`.text())
        .replace('<!--DOWNLOADS-->', downloads.join('\n'))
        .replace('<!--TECHNICAL_INFORMATION-->', technicalInformation);

    await $`glab release create v${version} -n "FireDragon v"${version} -N ${description} -a ${JSON.stringify(artifacts)}`;
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
        case 'ci-release':
            await ciRelease();
            break;
        default:
            throw `Unknown command: ${command}`;
    }
}
