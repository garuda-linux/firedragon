include "./settings";

def to_name:
    capture("(?<name>[^/]+/[^/]+).json$").name;

reduce inputs as $input ({}; . + {(input_filename | to_name): $input.timestamp})
