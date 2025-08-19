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
        for (const [i, line] of (await readFile(path, 'utf-8')).split('\n').entries()) {
            const trimmed = line.trim();

            const isCommand = trimmed.startsWith('#');
            let commandLine = null;
            let command = null;
            let args = null;
            if (isCommand) {
                commandLine = trimmed.substring(1).trim();
                [command, args] = commandLine.split(' ', 2).map(x => x.trim());
            }

            const isIf = command === 'if';
            const isIfdef = command === 'ifdef';
            const isIfndef = command === 'ifndef';
            const isEndif = command === 'endif';
            const isElseif = command === 'elseif';
            const isElse = command === 'else';
            const isFilter = command === 'filter';
            const isUnfilter = command === 'unfilter';
            const isInclude = command === 'include';
            const isDefine = command === 'define';

            const isKnownCommand = isIf || isIfdef || isIfndef || isEndif || isElseif || isElse || isFilter || isUnfilter || isInclude;
            if (isCommand && !isKnownCommand) {
                throw `Unknown command in line ${i + 1}: ${command}`;
            }

            if ((isIf || isIfdef || isIfndef || isElseif || isFilter || isUnfilter || isInclude || isDefine) && !args) {
                throw `Missing argument in line ${i + 1}: ${command}`;
            }

            if (isEndif || isElseif || isElse) {
                const conditionalItem = conditionalStack.shift();
                if (typeof conditionalItem !== 'boolean') {
                    throw `Unmatched ${command} in line ${i + 1}`;
                }
                if (isElseif || isElse) {
                    conditionalStack.unshift(!conditionalItem);
                }
            }
            if (isIf || isIfdef || isIfndef || isElseif) {
                let expression = args!;
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
                for (const filter of args!.split(' ')) {
                    if (!(filter in filters)) {
                        throw `Unknown filter: ${filter}`;
                    }
                    filters[filter as keyof typeof filters] = isFilter;
                }
            }
            if (isInclude) {
                output.push(await this.process(join(dirname(path), args!)));
            }
            if (isDefine) {
                const [name, expression] = args!.split(' ', 2);
                this.defines[name] = this.evaluateExpression(expression);
            }
            if (conditionalStack.every(x => x) && !isCommand) {
                output.push(this.processFilters(line, filters));
            }
        }
        return output.join('\n');
    }
}
