import fs from 'fs'
import {expandConfigurationFile, download} from 'vscode-extend-language'

/*
 * Generate a combined LaTeX Markdown grammar to be sued in LaTeX document
 * using the markdown package.
 */

async function insertLaTeXGrammar(url, latexScope, newScopeName, newGrammarFile) {
    const grammar = JSON.parse(await download(url))
    if(!grammar) {
       return
    }
    grammar['scopeName'] = newScopeName

    const includeLatex = {'include': latexScope}

    // Add latex scope before all patterns
    const patterns = grammar['patterns']
    if (!patterns) {
        console.log('Cannot find inline rule. Aborting.')
        return
    }
    patterns.splice(0, 0, includeLatex)

    // Add latex scope before all patterns in inline rule
    const inlineRule = grammar['repository']['inline']
    if (!inlineRule) {
        console.log('Cannot find inline rule. Aborting.')
        return
    }
    inlineRule.patterns.splice(0, 0, includeLatex)

    fs.writeFileSync(newGrammarFile, JSON.stringify(grammar, null, '\t'))
}

export function latexMd() {
    console.log('Generating markdown-latex grammar')
    insertLaTeXGrammar('https://raw.githubusercontent.com/microsoft/vscode/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json',
        'text.tex.latex',
        'text.tex.internal_only_markdown_latex_combined',
        './syntaxes/markdown-latex-combined.tmLanguage.json'
    )
    expandConfigurationFile('./src/markdown-latex-combined.language-configuration.json', './languages/markdown-latex-combined-language-configuration.json')
}
