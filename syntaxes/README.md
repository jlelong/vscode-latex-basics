# Syntax files

All these grammar files are generated from `src/`. 

## LaTeX.tmLanguage.json

Embedding languages into the LaTeX grammar requires to duplicate a lot of code with minor changes. To ease maintenance, all the language embeddings (basically `minted` and `XXXcode` blocks) are generated a script.

## cpp-grammar-bailout.tmLanguage.json

This is a modified C/C++ grammar file enhanced to make sure that the end of the LaTeX environment is properly detected.

## markdown-latex-combined.tmLanguage.json

This file is a combined markdown/LaTeX grammar file based on https://github.com/microsoft/vscode/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json.

