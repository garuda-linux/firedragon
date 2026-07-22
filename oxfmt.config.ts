import { defineConfig } from 'oxfmt';

export default defineConfig({
    ignorePatterns: [
        '/@types/gecko/',
        '/branding/',
        '/builtin-addons/startpage/',
        '/config/presets/firedragon.js',
        '/config/presets/librewolf.js',
        '/distribution/policies.json',
        '/profile/firedragon.js',
        '/skin/',
    ],
    sortImports: true,
    sortPackageJson: true,
    singleQuote: true,
    vueIndentScriptAndStyle: true,
});
