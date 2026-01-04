# FireDragon 13

This repository is a testbed for a new build system for the upcoming FireDragon 13.

## Development

First install the required dependencies:

```shell
pnpm install
```

Afterwards you can start the browser in development mode using:

```shell
pnpm make dev
```

To release a new version, update the version in `package.json` and run:

```shell
pnpm make release
```
