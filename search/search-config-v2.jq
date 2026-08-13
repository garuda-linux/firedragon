include "./search";

def modify_default:
    .globalDefault = "ddg" |
    .globalDefaultPrivate = "ddg" |
    .last_modified = timestamp |
    del(.specificDefaults);

def filter_engine:
    .identifier | test("^((ddg|google|qwant|startpage)$|wikipedia)");

def modify_engine_urls:
    del(.value.excludePartnerCodeFromTelemetry) |
    .value.base |= sub("(?<=[?&])partner=[^&]+(&|$)"; "") |
    if .value.params then
        .value.params |= [.[] | select(.value == "opensearch" or (.name | test("^(channel|client|ep|sourceid)$") | not) and .value != "{partnerCode}")]
    else
        .
    end;

def modify_engine:
    del(.base.partnerCode) |
    .last_modified = timestamp |
    .base.urls |= with_entries(modify_engine_urls) |
    if .identifier | test("^wikipedia") | not then
        .variants = [
            {
                "environment": {
                    "allRegionsAndLocales": true
                }
            }
        ]
    else
        .
    end;

def filter:
    if .recordType == "engine" then
        filter_engine
    elif .recordType == "engineOrders" then
        false
    else
        true
    end;

def modify:
    if .recordType == "defaultEngines" then
        modify_default
    elif .recordType == "engine" then
        modify_engine
    else
        .
    end;

.data |= [.[] | select(filter) | modify] + $search[0] |
.timestamp = timestamp
