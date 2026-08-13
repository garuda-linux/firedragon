FROM node:24-trixie

# Enable 32-bit support
RUN dpkg --add-architecture i386

# Update system
RUN apt-get update
RUN apt-get upgrade -y

# Install dependencies
RUN apt-get install -y flatpak glab jq libc6:i386 moreutils msitools p7zip-full python3-pip rsync rustup zstd

# Setup corepack
RUN corepack enable

# Setup rust with all required toolchains
ADD docker/install-rust.sh /usr/local/bin/install-rust.sh
RUN install-rust.sh

# Allow running appimage inside container
ENV APPIMAGE_EXTRACT_AND_RUN=1

# Allow running flatpak inside container
ENV FLATPAK_SYSTEM_HELPER_ON_SESSION=''
