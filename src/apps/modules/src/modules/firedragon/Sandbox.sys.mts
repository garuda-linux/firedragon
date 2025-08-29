export class Sandbox {
    private readonly sandbox: Sandbox;

    constructor(principal: nsIPrincipal | nsIPrincipal[] | null = null, options = {}) {
        this.sandbox = new Cu.Sandbox(principal, options);
    }

    cloneInto<T>(value: T, options = {}): T {
        return Cu.cloneInto(value, this.sandbox, options);
    }

    createObjectIn(name: string): object {
        return Cu.createObjectIn(this.sandbox, { defineAs: name });
    }

    defineFunction<T>(name, value: () => any): void {
        Cu.exportFunction(value, this.sandbox, { defineAs: name });
    }

    loadScript(url: string): void {
        Services.scriptloader.loadSubScript(url, this.sandbox);
    }
}
