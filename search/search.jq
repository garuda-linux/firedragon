def timestamp:
    now * 1000 | floor;

def match_engines:
    . == "bing" or
    . == "ddg" or
    . == "google" or
    . == "qwant" or
    . == "startpage" or
    startswith("wikipedia");
