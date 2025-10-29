import { globby } from 'globby';
import type { Plugin } from 'vite';

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
    for (const key in registration.flags ?? {}) {
        flags += buildRegistrationFlag(key, registration.flags[key]);
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

export interface Options {
    prefix?: string;
    preprocess?: boolean | string | RegExp | (string | RegExp)[];
    preprocessFilter?: string;
    registrations: Registration[];
}

function matchPreprocess(fileName: string, preprocess?: boolean | string | RegExp | (string | RegExp)[]): boolean {
    return preprocess && (
        preprocess === true ||
        preprocess === fileName ||
        preprocess instanceof RegExp && preprocess.test(fileName) ||
        Array.isArray(preprocess) && preprocess.some((p) => matchPreprocess(fileName, p))
    );
}

interface File {
    fileName: string;
    preprocess: boolean;
}

function generateLine(file: File, options: Options) {
    return `${file.preprocess ? '*' : ''} ${options.prefix ?? ''}${file.fileName} (${file.fileName})`;
}

export default function firedragonVite(options: Options): Plugin {
    let publicDir: string;
    return {
        name: 'jar-manifest',
        enforce: 'post',
        configResolved(config) {
            config.build.copyPublicDir = true;
            publicDir = config.publicDir;
        },
        async generateBundle(_options, bundle) {
            const files = (await globby('**/*', { cwd: publicDir })).map((fileName) => ({
                fileName,
                preprocess: matchPreprocess(fileName, options.preprocess),
            }));
            Object.values(bundle).forEach((file) => {
                const preprocess = matchPreprocess(file.fileName, options.preprocess);
                files.push({
                    fileName: file.fileName,
                    preprocess,
                });
                if (preprocess && options.preprocessFilter && file.code) {
                    file.code = `#filter ${options.preprocessFilter}\n${file.code}`;
                }
            });
            this.emitFile({
                type: 'asset',
                fileName: 'jar.mn',
                source: `firedragon.jar:${options.registrations ? '\n% ' + options.registrations.map(buildRegistration).join('\n% ') : ''}
${files.map((file) => generateLine(file, options)).join('\n')}
`,
            });
        },
    };
}
