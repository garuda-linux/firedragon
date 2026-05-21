export class SandboxBuilder {
    static create(principal: nsIPrincipal | nsIPrincipal[] | null = null, options: object = {}): SandboxBuilder {
        return new SandboxBuilder(
            Cu.Sandbox(principal ?? Services.scriptSecurityManager.createNullPrincipal({}), options),
        );
    }

    private constructor(public readonly sandbox: any) {}

    createObject(name: string): SandboxBuilder {
        return new SandboxBuilder(Cu.createObjectIn(this.sandbox, { defineAs: name }));
    }

    defineFunction(name: string, value: (...args: any) => any): SandboxBuilder {
        Cu.exportFunction(value, this.sandbox, { defineAs: name });
        return this;
    }

    defineGetter(name: string, value: () => any): SandboxBuilder {
        Object.defineProperty(this.sandbox, name, { get: value });
        return this;
    }

    eval(source: string, version?: any, filename?: any, lineNo?: i32, enforceFilenameRestrictions?: boolean): void {
        Cu.evalInSandbox(source, this.sandbox, version, filename, lineNo, enforceFilenameRestrictions);
    }

    load(url: string): void {
        Services.scriptloader.loadSubScript(url, this.sandbox);
    }
}
