import { globby } from 'globby';
import type { Plugin } from 'vite';

import { firefoxVersion } from '../../config.ts';
import generateJarManifest, { type Options } from './lib/jarManifest';

export function vite(options: Options): Plugin {
    let publicDir: string;
    let manifest: string | boolean = false;
    return {
        name: 'firedragon:vite',
        config(config) {
            config.build ??= {};
            config.build.target = `firefox${firefoxVersion.split('.')[0]}`;
            config.build.copyPublicDir = true;
        },
        configResolved(config) {
            publicDir = config.publicDir;
            manifest = config.build.manifest;
        },
        generateBundle: {
            order: 'post',
            async handler(_options, bundle) {
                const files = [
                    ...Object.values(bundle).map(({ fileName }) => fileName),
                    ...(await globby('**/*', { cwd: publicDir })),
                ];
                if (manifest) {
                    manifest = typeof manifest === 'boolean' ? '.vite/manifest.json' : manifest;
                    files.push(manifest);
                }
                this.emitFile({
                    type: 'asset',
                    fileName: 'jar.mn',
                    source: generateJarManifest(files, options),
                });
            },
        },
    };
}
