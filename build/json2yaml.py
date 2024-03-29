import yaml, json
from pathlib import Path

def json2yaml(infile):
    outfile = Path(infile).with_suffix('.yaml')
    try: 
        with open(infile, encoding='utf8') as fd:
            c = json.load(fd)
    except FileNotFoundError:
        print(f'Cannot open file {infile}')
        return
    try:
        with open(outfile, mode="w", encoding="utf8") as fd:
            yaml.dump(c, fd, indent=2)
    except FileNotFoundError:
        print(f'Cannot open file {infile}')
        return

json2yaml('../syntaxes/Bibtex.tmLanguage.json')
json2yaml('../syntaxes/TeX.tmLanguage.json')
json2yaml('../syntaxes/data/LaTeX.tmLanguage.json')
