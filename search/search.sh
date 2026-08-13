#!/usr/bin/env sh

set -eu

set -- "$1" "$(dirname "$0")" 'services/settings/dumps/main'

jq -f "$2"/search-config-v2.jq --slurpfile search "$2"/search.json "$1"/"$3"/search-config-v2.json > "$2"/search-config-v2.json
cat "$2"/icons/*.meta.json | jq -f "$2"/search-config-icons.jq --slurpfile icons /dev/stdin "$1"/"$3"/search-config-icons.json > "$2"/search-config-icons.json
