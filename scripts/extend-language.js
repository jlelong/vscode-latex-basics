import { expandConfiguration } from 'vscode-extend-languageconf'

console.log('Generating markdown-latex grammar')
expandConfiguration('./languages/data/markdown-latex-combined.extension.language-configuration.json', './languages/markdown-latex-combined-language-configuration.json')
