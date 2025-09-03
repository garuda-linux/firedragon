const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
    AppConstants: 'resource://gre/modules/AppConstants.sys.mjs',
});

export class File {
    static fromDirsvc(prop: string): File {
        return new File(Services.dirsvc.get(prop, Ci.nsIFile));
    }

    static fromPath(path: string): File {
        const file: nsIFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        file.initWithPath(path);
        return new File(file);
    }

    static fromUrl(url: nsIURI | URL | string): File {
        if (url instanceof URL || typeof url === 'string') {
            url = Services.io.newURI(url.toString());
        }
        if (url.prePath !== 'file://') {
            throw 'Not a valid file URL';
        }
        let filePath = decodeURIComponent(url.filePath);
        if (lazy.AppConstants.platform === 'win') {
            filePath = filePath.replace(/^\//, '').replace(/\//g, '\\');
        }
        return File.fromPath(filePath);
    }

    private constructor(
        private file: nsIFile,
    ) {}

    get path(): string {
        return this.file.path;
    }

    get url(): string {
        return Services.io.newFileURI(this.file).spec;
    }

    clone(): File {
        return new File(this.file.clone());
    }

    append(...nodes: string): File {
        for (const node of nodes) {
            this.file.append(node);
        }
        return this;
    }

    exists(): boolean {
        return this.file.exists();
    }
}
