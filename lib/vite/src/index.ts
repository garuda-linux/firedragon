import { globby } from 'globby';
import type { Plugin } from 'vite';

import { firefox } from '../../../package.json';

export interface RegistrationFlags {
    contentaccessible?: boolean;
    application?: string;
    process?: string;
}

export interface CategoryRegistration {
    type: 'category',
    category: string,
    entry: string,
    value: string,
    flags?: RegistrationFlags,
}

export interface ContentRegistration {
    type: 'content',
    name: string,
    path: string,
    flags?: RegistrationFlags,
}

export interface ResourceRegistration {
    type: 'resource',
    name: string,
    path: string,
    flags?: RegistrationFlags,
}

export type Registration = CategoryRegistration | ContentRegistration | ResourceRegistration;

export function buildRegistrationFlag<K extends keyof RegistrationFlags>(key: K, value: RegistrationFlags[K]) {
    switch (key) {
        case 'contentaccessible':
            if (value) {
                return ' contentaccessible=yes';
            }
            return '';
        case 'application':
            return ` application=${value}`;
        case 'process':
            return ` process=${value}`;
    }
}

export function buildRegistration(registration: Registration): string {
    let flags = '';
    if (registration.flags) {
        for (const key of Object.keys(registration.flags) as (keyof RegistrationFlags)[]) {
            if (typeof registration.flags[key] !== 'undefined') {
                flags += buildRegistrationFlag(key, registration.flags[key]);
            }
        }
    }
    switch (registration.type) {
        case 'category':
            return `category ${registration.category} ${registration.entry} ${registration.value}${flags}`;
        case 'content':
            return `content ${registration.name} ${registration.path}${flags}`;
        case 'resource':
            return `resource ${registration.name} ${registration.path}${flags}`;
    }
}

type MatchPattern = boolean | string | RegExp | (string | RegExp)[];

function match(fileName: string, pattern: MatchPattern): boolean {
    return !!pattern && (
        pattern === true ||
        pattern === fileName ||
        pattern instanceof RegExp && pattern.test(fileName) ||
        Array.isArray(pattern) && pattern.some((p) => match(fileName, p))
    );
}

interface File {
    fileName: string;
    preprocess: boolean;
}

export interface Options {
    prefix?: string;
    include?: MatchPattern;
    exclude?: MatchPattern;
    preprocess?: MatchPattern;
    preprocessFilter?: string;
    registrations: Registration[];
}

function generateLine(file: File, options: Options) {
    return `${file.preprocess ? '*' : ''} ${options.prefix ?? ''}${file.fileName} (${file.fileName})`;
}

export default function firedragonVite(options: Options): Plugin {
    let publicDir: string;
    let manifest: string | boolean = false;
    return {
        name: 'firedragon/vite',
        enforce: 'post',
        config(config) {
            config.build ??= {};
            config.build.target = `firefox${firefox.version.split('.')[0]}`;
            config.build.copyPublicDir = true;
        },
        configResolved(config) {
            publicDir = config.publicDir;
            manifest = config.build.manifest;
        },
        async generateBundle(_options, bundle) {
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
                manifest = typeof manifest === 'boolean' ? '.vite/manifest.json': manifest;
                files.push({
                    fileName: manifest,
                    preprocess: match(manifest, options.preprocess ?? false),
                });
            }
            this.emitFile({
                type: 'asset',
                fileName: 'jar.mn',
                source: `firedragon.jar:${options.registrations ? '\n% ' + options.registrations.map(buildRegistration).join('\n% ') : ''}
${files.filter(({ fileName }) => match(fileName, options.include ?? true) && !match(fileName, options.exclude ?? false)).map((file) => generateLine(file, options)).join('\n')}
`,
            });
        },
    };
}
