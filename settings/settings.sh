#!/usr/bin/env sh

set -eux

set -- "$(dirname "$0")" "$@"
set -- "$1" "$2"/services/settings/dumps "$1"/dumps

jq -f "$1"/search-config-v2.jq "$2"/main/search-config-v2.json "$1"/search-config-v2.json > "$3"/main/search-config-v2.json
jq -fn "$1"/search-config-icons.jq "$2"/main/search-config-icons/*.meta.json "$3"/main/search-config-icons/*.meta.json > "$3"/main/search-config-icons.json

jq -fn "$1"/last_modified.jq "$2"/*/*.json "$3"/*/*.json > "$3"/last_modified.json
