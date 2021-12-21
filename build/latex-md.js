import got from 'got'
import { writeFileSync } from 'fs'

async function downloadUrl(url) {
    try {
        const response = await got(url)
        return response.body.toString('utf-8')
    } catch (e) {
        console.log('Cannot retrieve: ', url)
        console.log('Error code:', e.response.statusCode)
        console.log('Error message:', e.response.statusMessage);
    }
    return undefined
}

async function insertLaTeXGrammar(url, latexScope, newScopeName, newGrammarFile) {
    const grammar = JSON.parse(await downloadUrl(url))
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

    writeFileSync(newGrammarFile, JSON.stringify(grammar, null, '\t'))
}

export default function main() {
    insertLaTeXGrammar('https://raw.githubusercontent.com/microsoft/vscode/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json',
        'text.tex.latex',
        'text.tex.markdown_latex_combined',
        './syntaxes/markdown-latex-combined.tmLanguage.json'
    )
}

