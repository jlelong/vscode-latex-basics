# Change Log

## [1.4.0] - 2022-08-03

### Added

- Support ``cite<...>` commands from apacite.
- (#26) Recognize envs from nicematrix package.
- (#29) Add pyluatex support.

### Changed

- (#30) Refactor how to tokenize `begin`/`end` statements.
- (#31) Refactor language embedding support: a new `js` script is responsible for generating the set of rules for every embedded language. This engineering change helps maintenance.

### Fixed

- (#33) Fix typo in word reference alternation.
- (#34) Remove double checking for `\|`.

## [1.3.0] - 2022-03-30

### Added

- (#21) Enable region folding in TeX and LaTeX files.
- (#16) Add `{` to `autoCloseBefore`.

### Changed

- (#20) Highlight `\label` with an optional argument.
- (#17) Adopt an inclusive definition of word pattern.

## [1.2.0] - 2022-01-15

### Added

- (#13) Add big delimiters `|`, `\|`, `[lr][vV]ert`, `\langle...\rangle` to bracket pairs.
- (#15) Declare the content of the environments `((?:julia|jl)(?:code|verbatim|block|concode|console|converbatim)` as Julia code.

## [1.1.0] - 2021-12-24

### Added

- (#8) Support for `NiceTabular`.
- (#11) Declare `\bigl...\bigr` and friends as bracket pairs.

### Changed

- (#6) Set a single grammar scope to variable-size delimiters to enable bracket pair highlighting and colouring.
- Remove support for DocTeX, BibTeX-Style, LaTeX3 and Weave LaTeX. These languages are directly provided by LaTeX-Workshop.
- Use [`vscode-extend-language`](https://github.com/jlelong/vscode-extend-language) to derive `markdown-latex` from `latex`.

### Fixed

- (#5) Wrong colouring of environment begin/end in inline maths.

## [1.0.0] - 2021-12-03

The LaTeX grammar and language configuration files are outsourced from https://github.com/James-Yu/LaTeX-Workshop.git to provide LaTeX grammar support in VS Code as a built-in extension.
