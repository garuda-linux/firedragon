include "./search";

def filter:
    (.engineIdentifiers | any(test("^(ddg|google|qwant|startpage|wikipedia\\*)$"))) and
    if .filter_expression then (.filter_expression | test("env.appinfo.OS == \"(iOS|Android)\"") | not) else true end;

def modify:
    del(.filter_expression) |
    .last_modified = timestamp |
    .engineIdentifiers |= if any(. == "ddg") then ["ddg*"] else . end;

.data |= [.[] | select(filter) | modify] + $icons |
.timestamp = timestamp
