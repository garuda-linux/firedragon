export class File {
    static fromDirsvc(prop: string): File {
        return new File(Services.dirsvc.get(prop, Ci.nsIFile));
    }

    static fromPath(path: string): File {
        const file: nsIFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        file.initWithPath(path);
        return new File(file);
    }

    constructor(
        private file: nsIFile,
    ) {}

    get path(): string {
        return this.file.path;
    }

    get url(): string {
        return `file://${this.path.replace(/\\/g, '/')}`;
    }

    clone(): File {
        return new File(this.file.clone());
    }

    append(node: string): File {
        this.file.append(node);
        return this;
    }

    exists(): boolean {
        return this.file.exists();
    }
}
