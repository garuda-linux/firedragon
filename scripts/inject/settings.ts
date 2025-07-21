import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import glob from 'fast-glob';
import { Preprocessor } from "../preprocessor/index.ts";

export async function injectSettings(binDir: string) {
    const config = (await import(`../../${binDir}/chrome/firedragon/content/firedragon.config.js`)).default;
    const preprocessor = new Preprocessor(config);
    await Promise.all((await glob(`**`, { cwd: 'settings', onlyFiles: true })).map(async (file) => {
        const path = join(binDir, file);
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, await preprocessor.process(join('settings', file)), 'utf-8');
    }));
}
