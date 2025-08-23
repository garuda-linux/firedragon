/// <reference types="zx/globals" />

import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { ElementCompact, js2xml, xml2js } from "npm:xml-js";
import packageJson from "./package.json" with { type: "json" };

const version = `v${packageJson.version}`;

async function updateMetainfo(file: string) {
    const metainfo: ElementCompact = xml2js(await readFile(file, 'utf-8'), { compact: true });
    const date = new Date();
    metainfo.component.releases.release.unshift({
        _attributes: {
            // Fix to have semver versions ordered correctly by appstream: https://github.com/ximion/appstream/issues/727#issuecomment-3213249520
            version: version.replace('-', '~'),
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
        },
        url: {
            _attributes: {
                type: 'details',
            },
            _text: `https://gitlab.com/garuda-linux/firedragon/firedragon12/-/releases/${version}`,
        },
        description: {},
    });
    await writeFile(file, js2xml(metainfo, { compact: true, spaces: 2 }), 'utf-8');
}

if (await $`git tag -l ${version}`.text()) {
    echo(`Tag ${version} already exists. Aborting...`);
    process.exit(1);
}

await updateMetainfo('assets/org.garudalinux.firedragon.metainfo.xml');

await $`git-cliff -c cliff.changelog.toml -u -t ${version} -p CHANGELOG.md`;

await $`git add package.json CHANGELOG.md assets/org.garudalinux.firedragon.metainfo.xml`;
await $`git commit -m 'release: '${version}`;
await $`git tag -m ${version} ${version}`
