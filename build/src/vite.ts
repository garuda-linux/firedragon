import { globby } from 'globby';
import type { Plugin } from 'vite';

import { firefoxVersion } from '../../config.ts';
import generateJarManifest, { type Options, match } from './lib/jarManifest';

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
                const files = (await globby('**/*', { cwd: publicDir })).map((fileName) => ({
                    fileName,
                    preprocess: match(fileName, options.preprocess ?? false),
                }));
                Object.values(bundle).forEach((file) => {
                    const preprocess = match(file.fileName, options.preprocess ?? false);
                    files.push({
                        fileName: file.fileName,
                        preprocess,
                    });
                    if (preprocess && options.preprocessFilter && file.type === 'chunk') {
                        file.code = `#filter ${options.preprocessFilter}\n${file.code}`;
                    }
                });
                if (manifest) {
                    manifest = typeof manifest === 'boolean' ? '.vite/manifest.json' : manifest;
                    files.push({
                        fileName: manifest,
                        preprocess: match(manifest, options.preprocess ?? false),
                    });
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
