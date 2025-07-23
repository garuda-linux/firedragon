# make

``` shell
deno task make [...options] [...targets]
```

## Options

| Option                                 | Description                                                                                                                |
|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `--enable-bootstrap`                   | Enable automatic installation of dependencies                                                                              |
| `--enable-update`                      | Build with update URL and package update MAR                                                                               |
| `--enable-artifact-build`              | Build with runtime artifact as base                                                                                        |
| `--dist-dir=DIST_DIR`                  | Set custom dist dir where finished packages will be moved                                                                  |
| `--edition=EDITION`                    | Set edition to build. Accepted values: `dr460nized`, `catppuccin`                                                          |
| `--target=TARGET`                      | Set target to build. Accepted values: `linux-x64`, `linux-arm64`, `win32-x64`, `win32-arm64`, `darwin-x64`, `darwin-arm64` |
| `--with-buildid2=BUILDID2`             | Set BuildID2 file to use during build. Run `deno task build --write-buildid2` to create `_dist/buildid2`.                  |
| `--with-moz-build-date=MOZ_BUILD_DATE` | Read `MOZ_BUILD_DATE` variable to use during build from file. Defaults to current date in `%Y%m%d%H%M%S` format.           |
| `--with-dist=DIST`                     | Set prebuilt dist files to use during build. Run `deno task build --release-build-before` to create `_dist/noraneko`.      |
| `--with-mozconfig`                     | Add additional mozconfig to append to FireDragon defaults.                                                                 |
| `--save-dist-host-bin=DIST_HOST_BIN`   | Save dist/host/bin as zstd to the provided path.                                                                           |
| `--with-dist-host-bin=DIST_HOST_BIN`   | Use dist/host/bin from provided path. Only required for generating update MAR when using artifact build.                   |

## Targets

| Target          | Description          |
|-----------------|----------------------|
| `source`        | Build source archive |
| `build-runtime` | Build runtime build  |
| `build`         | Build release build  |
| `appimage`      | Build AppImage       |

## Docker image

Each release publishes a docker image designed to have every dependency required to build FireDragon (at least with `--enable-bootstrap`). To use this image locally, you can use [distrobox](https://distrobox.it/):

``` shell
distrbox create -i registry.gitlab.com/garuda-linux/firedragon/firedragon12/make:latest -n firedragon12-make
distrobx enter firedragon12-make
```

But since distrobox creates an entirely new user, you will have to reinstall rust manually:

``` shell
install-rust.sh
```
