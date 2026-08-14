#!/usr/bin/env sh

set -eu

set -- "$(dirname "$0")" "$1"/services/settings/dumps/main

jq -f "$1"/search-config-v2.jq --slurpfile search "$1"/search.json "$2"/search-config-v2.json | sponge "$2"/search-config-v2.json
cat "$1"/icons/*.meta.json | jq -f "$1"/search-config-icons.jq --slurpfile icons /dev/stdin "$2"/search-config-icons.json | sponge "$2"/search-config-icons.json
