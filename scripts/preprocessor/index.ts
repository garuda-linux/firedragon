import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export class Preprocessor {
    public constructor(
        private defines: Record<string, any> = {},
    ) {}

    private evaluateExpression(expr: string): boolean {
        const ctx = {
            ...this.defines,
            defined: (name: string) => name in this.defines,
        };
        return new Function('ctx', `with (ctx) { return ${expr}; }`)(ctx);
    }

    private processFilters(value: string, filters: { substitution: boolean }): string {
        if (filters.substitution) {
            value = value.replace(/@([^@]+)@/g, (_, name) => this.defines[name]);
        }
        return value;
    }

    public async process(path: string): Promise<string> {
        const output = [];
        const conditionalStack = [true];
        const filters = { substitution: false };
        for (const line of (await readFile(path, 'utf-8')).split('\n')) {
            const trimmed = line.trim();
            const isIf = trimmed.startsWith('#if ');
            const isIfdef = trimmed.startsWith('#ifdef ');
            const isIfndef = trimmed.startsWith('#ifndef ');
            const isEndif = trimmed === '#endif';
            const isElseif = trimmed.startsWith('#elseif ');
            const isElse = trimmed === '#else';
            const isFilter = trimmed.startsWith('#filter ');
            const isUnfilter = trimmed.startsWith('#unfilter ');
            const isInclude = trimmed.startsWith('#include ');
            if (isEndif || isElseif || isElse) {
                const conditionalItem = conditionalStack.shift();
                if (typeof conditionalItem !== 'boolean') {
                    throw 'Unmatched if/endif/elseif/else';
                }
                if (isElseif || isElse) {
                    conditionalStack.unshift(!conditionalItem);
                }
            }
            if (isIf || isIfdef || isIfndef || isElseif) {
                let expression = trimmed.split(' ', 2)[1];
                if (isIfdef || isIfndef) {
                    expression = `defined(${JSON.stringify(expression)})`;
                }
                if (isIfndef) {
                    expression = `!${expression}`;
                }
                const result = this.evaluateExpression(expression);
                if (isElseif) {
                    conditionalStack[0] &&= result;
                } else {
                    conditionalStack.unshift(result);
                }
            }
            if (isFilter || isUnfilter) {
                const args = trimmed.split(' ').slice(1);
                for (const filter of args) {
                    if (!(filter in filters)) {
                        throw `Unknown filter: ${filter}`;
                    }
                    filters[filter as keyof typeof filters] = isFilter;
                }
            }
            if (isInclude) {
                const arg = trimmed.split(' ', 2)[1];
                output.push(await this.process(join(dirname(path), arg)));
            }
            if (conditionalStack.every(x => x) && !(isIf || isIfdef || isIfndef || isEndif || isElseif || isElse || isFilter || isUnfilter || isInclude)) {
                output.push(this.processFilters(line, filters));
            }
        }
        return output.join('\n');
    }
}
