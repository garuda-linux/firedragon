FROM node:22-trixie

# Update system
RUN apt-get update
RUN apt-get upgrade -y

# Install dependencies
RUN apt-get install -y msitools p7zip-full python3-pip rustup zstd

# Setup corepack
RUN corepack enable

# Setup rust with all required toolchains
ADD docker/install-rust.sh /usr/local/bin/install-rust.sh
RUN install-rust.sh

# Allow running appimage inside container
ENV APPIMAGE_EXTRACT_AND_RUN=1
