# Change Log

## [1.7.0] - 2024-01-04

### Added

- (#74) Support the `terminal` environment.

## [1.6.0] - 2023-11-03

### Changed

- (#70) Do not highlight double quoted text because it causes too many issues.
- (#72) Make sure `@` is a word character and not a delimiter when matching macro names. @muzimuzhi.
- (#65) Major improvement of the BibTeX grammar by @zepinglee:
  - Fix character class for BibTeX identifiers
  - Exclude closing brace in BibTeX entry key
  - Fix syntax of `@comment` command
  - Remove illegal character `@`
  - Fix `#` operator with other field tokens
  - Remove escaping braces in strings
  - Include nested braces in quote-delimited strings

### Fixed

- (#69, #67) Highlight the text parameter of `\href`, `\hyperimage` and `\hyperref` using the full LaTeX syntax.

## [1.5.4] - 2023-08-18

### Added

- (#63) Highlight non ascii characters in labels
- Recognize booktabs as an array environment

### Changed

- (#64) Revert #46 : `%` is a standard character in bibtex files
- (#65) Do not highlight single quoted text

## [1.5.3] - 2023-06-21

### Added

- (#59, #61) Support single and double quoted text
- (#59) Extend support for hyperlinks
- (#49, #56) Allow special characters and numbers in bibtex `@string` variables
- (#48, #50) Support non-Latin macro names

### Fixed

- Environments from `lstlistings` may not take any arg.
- (#60) Do not highlight `\%` in bibtex

## [1.5.2] - 2023-03-28

### Added

- Environments with name matching `[a-zA-Z]*code` are highlighted as minted
- (#46) Support % as a comment sign for bibtex files
- (#47) Capture urls in bibtex files

### Changed

- Use class `\p{Alphabetic}` instead of `\w` to allow accents in references and citations in LaTeX grammar.

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
