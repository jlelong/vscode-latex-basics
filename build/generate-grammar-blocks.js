const fs = require('fs')
const path = require('path')

const mintedEnvs = ['minted', 'lstlisting', 'pyglist']
const robustExternalizeEnvs = ['CacheMeCode', 'PlaceholderPathFromCode', 'PlaceholderFromCode', 'SetPlaceholderCode']
const mintedLanguages = [
    {language: ['asy', 'asymptote'], source: 'source.asy'},
    {language: ['c', 'cpp'], source: 'source.cpp.embedded.latex'},
    {language: ['css'], source: 'source.css'},
    {language: ['gnuplot'], source: 'source.gnuplot'},
    {language: ['hs', 'haskell'], source: 'source.haskell'},
    {language: ['html'], source: 'text.html.basic', contentName: 'text.html'},
    {language: ['java'], source: 'source.java'},
    {language: ['jl', 'julia'], source: 'source.julia'},
    {language: ['js', 'javascript'], source: 'source.js'},
    {language: ['lua'], source: 'source.lua'},
    {language: ['py', 'python'], source: 'source.python'},
    {language: ['rb', 'ruby'], source: 'source.ruby'},
    {language: ['rust'], source: 'source.rust'},
    {language: ['ts', 'typescript'], source: 'source.ts'},
    {language: ['xml'], source: 'text.xml'},
    {language: ['yaml'], source: 'source.yaml'},
]
const robustExternalizeLanguages = mintedLanguages.concat(
    {language: ['tikz', 'tikzpicture'], source: 'text.tex.latex'}
)

const codeLanguages = [
    {name: ['asy', 'asycode'], source: 'source.asymptote'},
    {name: ['cppcode'], source: 'source.cpp.embedded.latex'},
    {name: ['dot2tex', 'dotcode'], source: 'source.dot'},
    {name: ['gnuplot'], source: 'source.gnuplot'},
    {name: ['hscode'], source: 'source.haskell'},
    {name: ['jlcode', 'jlverbatim', 'jlblock', 'jlconcode', 'jlconsole', 'jlconverbatim'], source: 'source.julia'},
    {name: ['juliacode', 'juliaverbatim', 'juliablock', 'juliaconcode', 'juliaconsole', 'juliaconverbatim'], source: 'source.julia'},
    {name: ['luacode'], source: 'source.lua'},
    {name: ['pycode', 'pyverbatim', 'pyblock', 'pyconcode', 'pyconsole', 'pyconverbatim'], source: 'source.python'},
    {name: ['pylabcode', 'pylabverbatim', 'pylabblock', 'pylabconcode', 'pylabconsole', 'pylabconverbatim'], source: 'source.python'},
    {name: ['sageblock', 'sagesilent', 'sageverbatim', 'sageexample', 'sagecommandline', 'python', 'pythonq', 'pythonrepl'], source: 'source.python'},
    {name: ['scalacode'], source: 'source.scala'},
    {name: ['sympycode', 'sympyverbatim', 'sympyblock', 'sympyconcode', 'sympyconsole', 'sympyconverbatim'], source: 'source.python'},
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
 *  From minted `\begin{<env>}[<option list>]{<option list>}`
 * We match \begin{<env>}[<session>][<option list>]{<option list>} where the
 * three arguments are actually optional and <session> uses characters from [a-zA-Z0-9_-].
 * @param {string[]} envNames An array of environments, eg. ['pycode', 'pythoncode'] or ['luacode']
 * @param {string} source The source language to include
 * @param {string} contentName The scope to assign to the content. If undefined, use {@link source}
 */
function generateCodeBlock(envNames, source, contentName=undefined) {
    if (contentName === undefined) {
        contentName = source
    }
    var envNameRegex = '(?:' + envNames.join('|') + ')'
    const beginRule = `\\s*\\\\begin\\{${envNameRegex}\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)`
    const endRule = `\\s*\\\\end\\{${envNameRegex}\\*?\\}`

    const jsonCode = `{
    "begin": "${beginRule}",
    "end": "${endRule}",
    "captures": {
        "0": {
            "patterns": [
                {
                    "include": "#begin-env-tokenizer"
                }
            ]
        }
    },
    "patterns": [
        {
            "include": "#multiline-optional-arg-no-highlight"
        },
        {
            "begin": "(?:\\G|(?<=\\]))(\\{)",
            "beginCaptures": {
                "1": {
                    "name": "punctuation.definition.arguments.begin.latex"
                }
            },
            "end": "(\\})",
            "endCaptures": {
                "1": {
                    "name": "punctuation.definition.arguments.end.latex"
                }
            },
            "contentName": "variable.parameter.function.latex"
        },
        {
            "begin": "^(?=\\s*)",
            "end": "^\\s*(?=\\\\end\\{${envNameRegex}\\*?\\})",
            "contentName": "${source}",
            "patterns": [
                {
                    "include": "${source}"
                }
            ]
        }
    ]
}`
    return escapeBackSlash(jsonCode)

}

/**
 * Generate the json rules for a minted type block
 * @param {string[]} envNames Typically minted
 * @param {string[]} language A list of languages used to build an alternation
 * @param {string} source The source language to include
 * @param {string} contentName The scope to assign to the content. If undefined, use {@link source}
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

/**
 * Generate the json rules for a minted type block
 * @param {string[]} envNames Typically minted
 * @param {string[]} language A list of languages used to build an alternation
 * @param {string} source The source language to include
 * @param {string} contentName The scope to assign to the content. If undefined, use {@link source}
 */
function generateRobustExternalizeBlock(envNames, language, source, contentName=undefined) {
    if (contentName === undefined) {
        contentName = source
    }
    var languageRegex = '(?i:' + language.join('|') + ')'
    var envNameRegex = '(?:' + envNames.join('|') + ')'

    const jsonCode = `{
    "begin": "\\G(\\{)(?:__|[a-z\\s]*)${languageRegex}",
    "end": "(?=\\\\end\\{${envNameRegex}\\})",
    "beginCaptures": {
        "1": {
            "name": "punctuation.definition.arguments.begin.latex"
        }
    },
    "patterns": [
        {
            "begin": "\\G",
            "end": "(\\})\\s*$",
            "endCaptures": {
                "1": {
                    "name": "punctuation.definition.arguments.end.latex"
                }
            },
            "patterns": [
                {
                     "include": "text.tex#braces"
                },
                {
                    "include": "$base"
                }
            ]
        },
        {
            "begin": "^(\\s*)",
            "end": "^\\s*(?=\\\\end\\{${envNameRegex}\\})",
            "contentName": "${contentName}",
            "patterns": [
                {
                    "include": "${source}"
                }
            ]
        }
    ]
}`

    return escapeBackSlash(jsonCode)
}

function main() {
    console.log('Generating LaTeX.tmLanguage from data/')
    var mintedDefinitions = mintedLanguages.map(language => generateMintedBlock(mintedEnvs, language.language, language.source, language?.contentName)).join(',\n')
    var codeDefinitions = codeLanguages.map(language => generateCodeBlock(language.name, language.source, language?.contentName)).join(',\n')
    var robustExternalizeDefinitions = robustExternalizeLanguages.map(language => generateRobustExternalizeBlock(robustExternalizeEnvs, language.language, language.source, language?.contentName)).join(',\n')

    let text = fs.readFileSync(path.join(__dirname, '..', 'syntaxes', 'data', 'LaTeX.tmLanguage.json'), {encoding: 'utf8'})
    text = text.replace(/^\s*\{\{includeMintedblocks\}\}/gm, indent(4, mintedDefinitions))
    text = text.replace(/^\s*\{\{includeRobustExternalizeBlocks\}\}/gm, indent(4, robustExternalizeDefinitions))
    text = text.replace(/^\s*\{\{includeCodeBlocks\}\}/gm, indent(2, codeDefinitions))
    fs.writeFileSync(path.join(__dirname, '..', 'syntaxes', 'LaTeX.tmLanguage.json'), text)
}


module.exports = main
