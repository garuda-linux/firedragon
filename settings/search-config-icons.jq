include "./settings";

def modify:
    if .engineIdentifiers | any(. == "ddg") then
        .engineIdentifiers = ["ddg*"] |
        .last_modified = timestamp
    else . end;

{
    "data": [inputs | modify],
    "timestamp": timestamp
}
