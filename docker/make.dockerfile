FROM denoland/deno:bin-2.5.0 AS deno

FROM ubuntu:latest

# Update system
RUN apt-get update
RUN apt-get upgrade -y

# Install dependencies
RUN apt-get install -y curl file msitools nodejs p7zip-full patch python3-pip ripgrep rsync rustup watchman zip zstd

# Setup rust with all required toolchains
ADD docker/install-rust.sh /usr/local/bin/install-rust.sh
RUN install-rust.sh

# Install deno
COPY --from=deno /deno /usr/local/bin/deno

# Allow running appimage inside container
ENV APPIMAGE_EXTRACT_AND_RUN=1
