import { globby } from 'globby';
import type { Plugin } from 'vite';

export interface RegistrationFlags {
    contentaccessible?: boolean;
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
    registrations: Registration[];
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
            this.emitFile({
                type: 'asset',
                fileName: 'jar.mn',
                source: `firedragon.jar:${options.registrations ? '\n% ' + options.registrations.map(buildRegistration).join('\n% ') : ''}
 ${Object.keys(bundle).concat(await globby('**/*', { cwd: publicDir })).map((fileName) => `${options.prefix ?? ''}${fileName} (${fileName})`).join('\n ')}
`,
            });
        },
    };
}
