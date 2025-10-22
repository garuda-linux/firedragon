#!/usr/bin/env sh

set -e

rustup default stable
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin
rustup target add aarch64-unknown-linux-gnu
rustup target add x86_64-unknown-linux-gnu
rustup target add aarch64-pc-windows-msvc
rustup target add x86_64-pc-windows-msvc
