# Change Log

## [1.5.1] - 2023-02-11

### Added

- Declare `\{...\}` as a bracket pair.
- Highlight `\refcite`. See https://github.com/James-Yu/LaTeX-Workshop/pull/3597.

### Changed

- Allow single letter words. See https://github.com/microsoft/vscode/issues/170588.
- (#41) Make `[]` optional for code environments.

### Fixed

- (#44) Consistent highlighting of keywords followed by numbers
- (#43) Update `\if...`- and csname-related TeX primitives

## [1.5.0] - 2022-11-10

### Added

- (#38) Add `\left. ... \right|` and vice-versa as bracket pairs.
- (#37) Add `tabularray` support.
- (#36) Recognize multiline options in `\usepackage` commands.
- (#28) Recognize multiline options in minted and code environments.

### Changed

- Use `arguments.optional` instead of `optional.arguments` in scope names.

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
