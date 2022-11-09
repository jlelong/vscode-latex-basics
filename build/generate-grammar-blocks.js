const fs = require('fs')
const path = require('path')

const mintedLanguages = [
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['c', 'cpp'], source: 'source.cpp.embedded.latex'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['asy', 'asymptote'], source: 'source.asy'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['css'], source: 'source.css'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['hs', 'haskell'], source: 'source.haskell'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['html'], source: 'text.html.basic', contentName: 'text.html'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['xml'], source: 'text.xml'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['java'], source: 'source.java'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['lua'], source: 'source.lua'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['jl', 'julia'], source: 'source.julia'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['rb', 'ruby'], source: 'source.ruby'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['js', 'javascript'], source: 'source.js'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['ts', 'typescript'], source: 'source.ts'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['py', 'python'], source: 'source.python'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['yaml'], source: 'source.yaml'},
    {name: ['minted', 'lstlisting', 'pyglist'], language: ['rust'], source: 'source.rust'},
]

const codeLanguages = [
    {name: ['cppcode'], source: 'source.cpp.embedded.latex'},
    {name: ['hscode'], source: 'source.haskell'},
    {name: ['luacode'], source: 'source.lua'},
    {name: ['jlcode', 'jlverbatim', 'jlblock', 'jlconcode', 'jlconsole', 'jlconverbatim'], source: 'source.julia'},
    {name: ['juliacode', 'juliaverbatim', 'juliablock', 'juliaconcode', 'juliaconsole', 'juliaconverbatim'], source: 'source.julia'},
    {name: ['sageblock', 'sagesilent', 'sageverbatim', 'sageexample', 'sagecommandline', 'python', 'pythonq', 'pythonrepl'], source: 'source.python'},
    {name: ['pycode', 'pyverbatim', 'pyblock', 'pyconcode', 'pyconsole', 'pyconverbatim'], source: 'source.python'},
    {name: ['pylabcode', 'pylabverbatim', 'pylabblock', 'pylabconcode', 'pylabconsole', 'pylabconverbatim'], source: 'source.python'},
    {name: ['sympycode', 'sympyverbatim', 'sympyblock', 'sympyconcode', 'sympyconsole', 'sympyconverbatim'], source: 'source.python'},
    {name: ['scalacode'], source: 'source.scala'},
    {name: ['asy', 'asycode'], source: 'source.asymptote'},
    {name: ['dot2tex', 'dotcode'], source: 'source.dot'},
    {name: ['gnuplot'], source: 'source.gnuplot'}
]


/**
 * Indent text and replace spaces indentation with tabs
 * @param {number} count The number of tabs to insert at the beginning of each line
 * @param {string} text A multiline text
 */
function indent(count, text) {
    const indent = new Array(count + 1).join('\t')
    return text.replace(/ {4}/gm, '\t').replace(/^/gm, indent)
}

function escapeBackSlash(text) {
    return text.replaceAll('\\', '\\\\')
}

/**
 * Generate the json rules for a code block:
 *  From pythontex `\begin{<env>}[<session>][<fancyvrb setting>]`
 *  From minted `\begin{<env>}{<option list>}`
 * @param {string[]} envNames An array of environments, eg. ['pycode', 'pythoncode'] or ['luacode']
 * @param {string} source The source language to include
 */
function generateCodeBlock(envNames, source, contentName=undefined) {
    if (contentName === undefined) {
        contentName = source
    }
    var envNameRegex = '(?:' + envNames.join('|') + ')'
    const beginRule = `(\\s*\\\\begin\\{(${envNameRegex}\\*?)\\}(?:\\[.*\\])?(?:\\{.*\\})?)`

    const jsonCode = `{
    "begin": "${beginRule}",
    "captures": {
        "1": {
            "patterns": [
                {
                    "include": "#begin-env-tokenizer"
                }
            ]
        }
    },
    "contentName": "${source}",
    "patterns": [
        {
            "include": "${source}"
        }
    ],
    "end": "(\\\\end\\{\\2\\}(?:\\s*\\n)?)"
}`
    return escapeBackSlash(jsonCode)

}

/**
 * Generate the json rules for a minted type block
 * @param {string} envName Typically minted
 * @param {string[]} language A list of languages used to build an alternation
 * @param {string} source The source language to include
 */
function generateMintedBlock(envNames, language, source, contentName=undefined) {
    if (contentName === undefined) {
        contentName = source
    }
    var languageRegex = '(?:' + language.join('|') + ')'
    var envNameRegex = '(?:' + envNames.join('|') + ')'

    const jsonCode = `{
    "begin": "(?:\\G|(?<=\\]))(\\{)(${languageRegex})(\\})",
    "beginCaptures": {
        "1": {
            "name": "punctuation.definition.arguments.begin.latex"
        },
        "2": {
            "name": "variable.parameter.function.latex"
        },
        "3": {
            "name": "punctuation.definition.arguments.end.latex"
        }
    },
    "end": "^\\s*(?=\\\\end\\{${envNameRegex}\\})",
    "contentName": "${contentName}",
    "patterns": [
        {
            "include": "${source}"
        }
    ]
}`

    return escapeBackSlash(jsonCode)
}

function main() {
    console.log('Generating LaTeX.tmLanguage from data/')
    var mintedDefinitions = mintedLanguages.map(language => generateMintedBlock(language.name, language.language, language.source, language?.contentName)).join(',\n')
    var codeDefinitions = codeLanguages.map(language => generateCodeBlock(language.name, language.source, language?.contentName)).join(',\n')

    let text = fs.readFileSync(path.join(__dirname, '..', 'syntaxes', 'data', 'LaTeX.tmLanguage.json'), {encoding: 'utf8'})
    text = text.replace(/^\s*\{\{includeMintedblocks\}\}/gm, indent(4, mintedDefinitions))
    text = text.replace(/^\s*\{\{includeCodeBlocks\}\}/gm, indent(2, codeDefinitions))
    fs.writeFileSync(path.join(__dirname, '..', 'syntaxes', 'LaTeX.tmLanguage.json'), text)
}


module.exports = main
