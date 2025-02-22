# VSCode LaTeX grammars

The files contained in this repository were originally part of https://github.com/James-Yu/LaTeX-Workshop. They have been extracted in the hope that they can be useful outside of the LaTeX-Workshop extension. In particular, these files are used by VS Code to provide built-in syntax highlighting for BibTeX, LaTeX and TeX (to appear in the January 2022 release).

This repository contains `tmLangugage` grammar files for LaTeX and BibTeX. These grammar files specifically target [Visual Studio Code](https://github.com/Microsoft/vscode) as they are accompanied by the corresponding language configuration files. However, the grammar files could in principle be consumed by any editor or extension using the TextMate language.

The grammar files support various embedded languages: `asymptote`, `c/c++`, `css`, `dot`, `gnuplot`, `html`, `java`, `javascript`, `julia`, `lua`, `python`, `ruby`, `scala`, `typescript`, `xml`, `yaml` and combined LaTeX and markdown to be used with the `markdown` package.

## Embedded code blocks

Since textmate grammars are purely static, it is not possible to inject new rules based on definitions containted in the LaTeX project. Environments defined by macros like `\lstnewenvironment{javacode}[1][language=java]{}{}` cannot be dynamically recognized by the grammar. So, we have decided to use the following convention: an environment named after `language` + `code` is supposed to embed `language`. Here is the complete list of hard coded environment names using this convention


| Name                                                                                                           | Source    |
|----------------------------------------------------------------------------------------------------------------|-----------|
| `asy`, `asycode`                                                                                               | Asymptote |
| `cppcode`                                                                                                      | c++       |
| `dot2tex`, `dotcode`                                                                                           | Dot       |
| `gnuplot`                                                                                                      | Gnuplot   |
| `hscode`                                                                                                       | Haskell   |
| `javacode`, `jjavaerbatim`, `javablock`, `jjavaoncode`, `javaconsole`, `javaconverbatim`                       | Java      |
| `jlcode`, `jlverbatim`, `jlblock`, `jlconcode`, `jlconsole`, `jlconverbatim`                                   | Julia     |
| `juliacode`, `juliaverbatim`, `juliablock`, `juliaconcode`, `juliaconsole`, `juliaconverbatim`                 | Julia     |
| `luacode`                                                                                                      | lua       |
| `pycode`, `pyverbatim`, `pyblock`, `pyconcode`, `pyconsole`, `pyconverbatim`                                   | Python    |
| `pylabcode`, `pylabverbatim`, `pylabblock`, `pylabconcode`, `pylabconsole`, `pylabconverbatim`                 | Python    |
| `sageblock`, `sagesilent`, `sageverbatim`, `sageexample`, `sagecommandline`, `python`, `pythonq`, `pythonrepl` | Python    |
| `scalacode`                                                                                                    | Scala     |
| `sympycode`, `sympyverbatim`, `sympyblock`, `sympyconcode`, `sympyconsole`, `sympyconverbatim`                 | Python    |

The starred version of the environments are also recognized.

## Internal only languages

### Combined LaTeX/Markdown grammar

The combined Markdown/LaTeX grammar [syntaxes/markdown-latex-combined.tmLanguage.json](syntaxes/markdown-latex-combined.tmLanguage.json) is designed to match the code inside the `markdown` environment in LaTeX files, which accepts both LaTeX and Markdown instructions.

### C++ bailed out grammar

The C++ bailed out grammar [syntaxes/cpp-grammar-bailout.tmLanguage.json](syntaxes/cpp-grammar-bailout.tmLanguage.json) is used for C/C++ code blocks inside LaTeX files.

## License

If not otherwise specified (see below), files in this repository fall under the license stated in [LICENSE.txt](LICENSE.txt)

### LaTeX grammar

The LaTeX grammar [syntaxes/LaTeX.tmLanguage.json](syntaxes/LaTeX.tmLanguage.json) is based on https://github.com/textmate/latex.tmbundle/blob/master/Syntaxes/LaTeX.plist but has been largely modified. The original file falls under the following license

    Permission to copy, use, modify, sell and distribute this
    software is granted. This software is provided "as is" without
    express or implied warranty, and with no claim as to its
    suitability for any purpose.

### Combined LaTeX/Markdown grammar

The combined Markdown/LaTeX grammar [syntaxes/markdown-latex-combined.tmLanguage.json](syntaxes/markdown-latex-combined.tmLanguage.json) is generated from the Markdown grammar included in VSCode and falls under the license described in [markdown-latex-combined-license.txt](markdown-latex-combined-license.txt).

### C++ bailed out grammar

The file [syntaxes/cpp-grammar-bailout.tmLanguage.json](syntaxes/cpp-grammar-bailout.tmLanguage.json) is generated from https://github.com/jeff-hykin/better-cpp-syntax and falls under the license described in [cpp-bailout-license.txt](cpp-bailout-license.txt).

## Tests

To run the grammar tests

    npm run test

The test cases are stored as `.tex` files under `test/colorize-fixtures`. Grammar test results are stored under `test/colorize-results`, which are automatically generated from the fixtures.
