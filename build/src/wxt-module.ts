import { writeFile } from 'node:fs/promises';

import { globby } from 'globby';
import { defineWxtModule } from 'wxt/modules';

import { firefoxVersion, version } from '../../config.ts';
import generateJarManifest, { type File, type Options as JarManifestOptions, match } from './lib/jarManifest';
import type { ExperimentApiOptions } from './types/wxt';

export interface Options {
    id: string;
    name: string;
    vendor?: string;
    jarManifest?: JarManifestOptions;
}

declare module 'wxt' {
    export interface InlineConfig {
        firedragon: Options;
    }
}

export default defineWxtModule<Options>({
    name: 'firedragon',
    configKey: 'firedragon',
    imports: [{ from: '@firedragon/build/wxt-client', name: 'defineExperimentApi' }],
    setup(wxt, options) {
        options!.vendor ??= 'firedragon.garudalinux.org';
        options!.jarManifest ??= {};
        options!.jarManifest.jar ??= 'browser';
        options!.jarManifest.prefix ??= `builtin-addons/${options!.id}/`;

        wxt.hooks.hook('config:resolved', () => {
            wxt.config.manifest.version = version;
        });

        wxt.hooks.hook('build:manifestGenerated', (_, manifest) => {
            manifest.name = options!.name;
            manifest.browser_specific_settings = {
                gecko: {
                    id: `${options!.id}@${options!.vendor}`,
                    strict_min_version: firefoxVersion.split('.').slice(0, 2).join('.'),
                },
            };
        });
        wxt.hooks.hook('vite:build:extendConfig', (_, config) => {
            config.build ??= {};
            config.build.target = `firefox${firefoxVersion.split('.')[0]}`;

            config.plugins ??= [];
            config.plugins.push({
                name: 'wxt-module-firedragon-preprocess',
                enforce: 'post',
                generateBundle(_, output) {
                    Object.values(output).forEach((chunk) => {
                        const preprocess = match(chunk.fileName, options!.jarManifest!.preprocess);
                        if (preprocess && options!.jarManifest!.preprocessFilter && chunk.type === 'chunk') {
                            chunk.code = `#filter ${options!.jarManifest!.preprocessFilter}\n${chunk.code}`;
                        }
                    });
                },
            });
        });
        wxt.hooks.hook('build:done', async (_, output) => {
            const files: File[] = output.publicAssets.map((file) => ({
                fileName: file.fileName,
                preprocess: match(file.fileName, options!.jarManifest!.preprocess),
            }));
            for (const step of output.steps) {
                for (const chunk of step.chunks) {
                    files.push({
                        fileName: chunk.fileName,
                        preprocess: match(chunk.fileName, options!.jarManifest!.preprocess),
                    });
                }
            }
            await writeFile(wxt.config.outDir + '/jar.mn', generateJarManifest(files, options!.jarManifest!));
            output.publicAssets.push({
                type: 'asset',
                fileName: 'jar.mn',
            });
        });
        wxt.hooks.hook('entrypoints:resolved', async (_, entrypoints) => {
            const dir = wxt.config.entrypointsDir + '/experiment-api';
            await Promise.all(
                (await globby('*.ts', { cwd: dir })).map(async (fileName) => {
                    const path = dir + '/' + fileName,
                        name = fileName.replace(/\.ts/, ''),
                        options = await wxt.builder.importEntrypoint<ExperimentApiOptions>(path);
                    entrypoints.push({
                        type: 'unlisted-script',
                        inputPath: path,
                        name,
                        outputDir: wxt.config.outDir + '/experiment-api',
                        options,
                    });
                    wxt.hooks.hookOnce('build:manifestGenerated', (_, manifest) => {
                        manifest.experiment_apis ??= {};
                        manifest.experiment_apis[name] = {
                            schema: `experiment-api/${name}.json`,
                            [options.type ?? 'parent']: {
                                scopes: [`addon_${options.type ?? 'parent'}`],
                                script: `experiment-api/${name}.js`,
                            },
                        };
                        if (options.namespace) {
                            manifest.experiment_apis[name][options.type ?? 'parent'].paths = [[options.namespace]];
                        }
                    });
                    wxt.hooks.hookOnce('build:publicAssets', (_, assets) => {
                        assets.push({
                            relativeDest: `experiment-api/${name}.json`,
                            contents: JSON.stringify([
                                {
                                    namespace: options.namespace,
                                    events: options.events,
                                    functions: options.functions,
                                },
                            ]),
                        });
                    });
                    wxt.hooks.hook('vite:build:extendConfig', (entrypoints, config) => {
                        if (entrypoints[0]?.inputPath === path) {
                            // @ts-ignore
                            config.build!.lib!.name = name;
                            // @ts-ignore
                            config.plugins = config.plugins!.filter((plugin) => plugin?.name !== 'wxt:iife-footer');
                        }
                    });
                }),
            );
        });
    },
});
