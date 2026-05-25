export interface RegistrationFlags {
    contentaccessible?: boolean;
    application?: string;
    process?: string;
}

export interface CategoryRegistration {
    type: 'category';
    category: string;
    entry: string;
    value: string;
    flags?: RegistrationFlags;
}

export interface ContentRegistration {
    type: 'content';
    name: string;
    path: string;
    flags?: RegistrationFlags;
}

export interface ResourceRegistration {
    type: 'resource';
    name: string;
    path: string;
    flags?: RegistrationFlags;
}

export interface SkinRegistration {
    type: 'skin';
    package: string;
    name: string;
    path: string;
    flags?: RegistrationFlags;
}

export type Registration = CategoryRegistration | ContentRegistration | ResourceRegistration | SkinRegistration;

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

export function buildRegistrationFlags(flags: RegistrationFlags = {}) {
    return Object.entries(flags)
        .map(([key, value]) => buildRegistrationFlag(key as keyof RegistrationFlags, value))
        .join(' ');
}

export function buildRegistration(registration: Registration): string {
    switch (registration.type) {
        case 'category':
            return `category ${registration.category} ${registration.entry} ${registration.value}${buildRegistrationFlags(registration.flags)}`;
        case 'content':
            return `content ${registration.name} ${registration.path}${buildRegistrationFlags(registration.flags)}`;
        case 'resource':
            return `resource ${registration.name} ${registration.path}${buildRegistrationFlags(registration.flags)}`;
        case 'skin':
            return `skin ${registration.package} ${registration.name} ${registration.path}${buildRegistrationFlags(registration.flags)}`;
    }
}

export type MatchPattern = boolean | string | RegExp | (string | RegExp)[];

export function match(fileName: string, pattern?: MatchPattern): boolean {
    return (
        !!pattern &&
        (pattern === true ||
            pattern === fileName ||
            (pattern instanceof RegExp && pattern.test(fileName)) ||
            (Array.isArray(pattern) && pattern.some((p) => match(fileName, p))))
    );
}

export interface Options {
    jar?: string;
    prefix?: string;
    include?: MatchPattern;
    exclude?: MatchPattern;
    preprocess?: MatchPattern;
    registrations?: Registration[];
}

export function generateLines(files: string[], options?: Options): string[] {
    return [
        ...(options?.registrations?.map((registration) => `% ${buildRegistration(registration)}`) ?? []),
        ...files.map(
            (file) =>
                `${match(file, options?.preprocess ?? false) ? '*' : ' '} ${options?.prefix ?? ''}${file} (${file})`,
        ),
    ];
}

export default function generateJarManifest(files: string[], options?: Options): string {
    files = files
        .filter((file) => match(file, options?.include ?? true) && !match(file, options?.exclude ?? false))
        .sort();
    return `${options?.jar ?? 'firedragon'}.jar:
${generateLines(files, options).join('\n')}
`;
}
