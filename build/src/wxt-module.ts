import { writeFile } from 'node:fs/promises';

import { globby } from 'globby';
import { defineWxtModule } from 'wxt/modules';

import { firefoxVersion, version } from '../../config.ts';
import generateJarManifest, { type Options as JarManifestOptions } from './lib/jarManifest';
import type { ExperimentApiOptions } from './types/wxt';

export interface Options {
    id: string;
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
            manifest.permissions ??= [];
            manifest.permissions.push('firedragon');

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
        });
        wxt.hooks.hook('build:done', async (_, output) => {
            const files = [
                ...output.publicAssets.map(({ fileName }) => fileName),
                ...output.steps.flatMap(({ chunks }) => chunks.map(({ fileName }) => fileName)),
            ];
            await writeFile(wxt.config.outDir + '/jar.mn', generateJarManifest(files, options!.jarManifest));
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
                            [options.registration.scope]: {
                                script: `experiment-api/${name}.js`,
                                scopes: [`addon_${options.registration.scope}`],
                                events: options.registration.events,
                                paths: options.registration.paths,
                            },
                        };
                    });
                    wxt.hooks.hookOnce('build:publicAssets', (_, assets) => {
                        assets.push({
                            relativeDest: `experiment-api/${name}.json`,
                            contents: JSON.stringify([
                                {
                                    namespace: options.definitions.namespace,
                                    events: options.definitions.events,
                                    functions: options.definitions.functions,
                                },
                            ]),
                        });
                    });
                    wxt.hooks.hook('vite:build:extendConfig', (entrypoints, config) => {
                        if (entrypoints[0]?.inputPath === path) {
                            // @ts-ignore
                            config.build!.lib!.name = name;
                            // @ts-ignore
                            config.plugins = config.plugins!.filter((plugin) => plugin?.name !== 'wxt:iife-anonymous');
                        }
                    });
                }),
            );
        });
        wxt.hooks.hook('prepare:types', async (_, entries) => {
            entries.push({
                module: '@firedragon/shared/types/extensions',
            });
        });
    },
});
