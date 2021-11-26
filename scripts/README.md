# Grammar files

## generate-bailout.js

The script `generate-bailout.js` is responsible for generating a modified C/C++ grammar file based on https://github.com/jeff-hykin/better-cpp-syntax. The new grammar file is `syntaxes/cpp-grammar-bailout.tmLanguage.json` and makes sure that the end of the LaTeX environment is properly detected.

## latex-md.js

The script `latex-md.js` is responsible for generating a combined markdown/LaTeX grammar file based on https://github.com/microsoft/vscode/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json. The new grammar file is `syntaxes/markdown-latex-combined.tmLanguage.json` and is used to match the content of the `markdown` environment, which allows a combination of LaTeX and markdown codes.
