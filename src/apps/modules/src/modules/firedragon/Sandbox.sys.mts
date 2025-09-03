export class Sandbox {
    static create(principal: nsIPrincipal | nsIPrincipal[] | null = null, options = {}) {
        return new Sandbox(new Cu.Sandbox(principal, options));
    }

    private constructor(
        private global: any,
    ) {}

    cloneInto<T>(value: T, options = {}): T {
        return Cu.cloneInto(value, this.global, options);
    }

    createObjectIn(name: string): Sandbox {
        return new Sandbox(Cu.createObjectIn(this.global, { defineAs: name }));
    }

    defineFunction(name: string, value: () => any): void {
        Cu.exportFunction(value, this.global, { defineAs: name });
    }

    defineGetter(name: string, value: () => any): void {
        Object.defineProperty(this.global, name, {
            get: value,
        });
    }

    loadScript(url: string): void {
        Services.scriptloader.loadSubScript(url, this.global);
    }
}
