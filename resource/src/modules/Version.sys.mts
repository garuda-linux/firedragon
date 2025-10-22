import { match } from 'ts-pattern';

export class Version {
    static REGEXP = /^v?([0-9]+)\.([0-9]+)\.([0-9]+)(?:\.([0-9]+))?$/;

    parts: [number, number, number, number];

    constructor(version: string) {
        if (Version.REGEXP.test(version)) {
            this.parts = version.match(Version.REGEXP).slice(1).map((part) => Number(part) || 0);
        } else {
            throw `Invalid version format: ${version}`;
        }
    }

    get generation(): number {
        return this.parts[0];
    }

    get major(): number {
        return this.parts[1];
    }

    get minor(): number {
        return this.parts[2];
    }

    get patch(): number {
        return this.parts[3];
    }

    compare(cmp: string, other: Version) {
        const cmpFn = match(cmp)
            .with('=', () => () => (a, b) => a === b)
            .with('<', () => (a, b) => a < b)
            .with('<=', () => (a, b) => a <= b)
            .with('>', () => (a, b) => a > b)
            .with('>=', () => (a, b) => a >= b)
            .exhaustive();
        if (this.generation === other.generation) {
            if (this.major === other.major) {
                if (this.minor === other.minor) {
                    return cmpFn(this.patch, other.patch);
                }
                return cmpFn(this.minor, other.minor);
            }
            return cmpFn(this.major, other.major);
        }
        return cmpFn(this.generation, other.generation);
    }

    toString(): string {
        return `v${this.generation}.${this.major}.${this.minor}${this.patch ? `.${this.patch}` : ''}`;
    }
}
