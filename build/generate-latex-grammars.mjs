import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const syntaxesDir = './syntaxes'
const syntaxesSrcDir = './src'

const mintedEnvs = ['minted', 'lstlisting', 'pyglist']
const robustExternalizeEnvs = ['CacheMeCode', 'PlaceholderPathFromCode\\*?', 'PlaceholderFromCode\\*?', 'SetPlaceholderCode\\*?']
const mintedLanguages = [
    {language: ['asy', 'asymptote'], source: 'source.asy'},
    {language: ['bash'], source: 'source.shell'},
    {language: ['c', 'cpp'], source: 'source.cpp.embedded.latex'},
    {language: ['css'], source: 'source.css'},
    {language: ['gnuplot'], source: 'source.gnuplot'},
    {language: ['hs', 'haskell'], source: 'source.haskell'},
    {language: ['html'], source: 'text.html.basic', contentName: 'text.html'},
    {language: ['java'], source: 'source.java'},
    {language: ['jl', 'julia'], source: 'source.julia'},
    {language: ['js', 'javascript'], source: 'source.js'},
    {language: ['lua'], source: 'source.lua'},
    {language: ['py', 'python', 'sage'], source: 'source.python'},
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
    {name: ['javacode', 'javaverbatim', 'javablock', 'javaconcode', 'javaconsole', 'javaconverbatim'], source: 'source.java'},
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
 * Convert an input yaml file to a json output file
 * @param {string} inputfile a yaml file name
 * @param {string} outputfile a json file name
 */
function convertYamlToJson(inputfile, outputfile) {
    try {
        const grammar = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}))
        fs.writeFileSync(outputfile, JSON.stringify(grammar, undefined, 4))
    } catch (error) {
        console.log(error)
    }
}

/**
 * Indent text
 * @param {number} count The number of tabs to insert at the beginning of each line
 * @param {string} text A multiline text
 */
function indent(count, text) {
    const indent = new Array(count + 1).join(' ')
    return text.replace(/^/gm, indent)
}

function escapeBackSlash(text) {
    return text
    // return text.replaceAll('\\', '\\\\')
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

    const yamlCode = `- begin: ${beginRule}
  end: ${endRule}
  captures:
    '0':
      patterns:
      - include: '#begin-env-tokenizer'
  patterns:
  - include: '#multiline-optional-arg-no-highlight'
  - begin: (?:\\G|(?<=\\]))(\\{)
    beginCaptures:
      '1':
        name: punctuation.definition.arguments.begin.latex
    end: (\\})
    endCaptures:
      '1':
        name: punctuation.definition.arguments.end.latex
    contentName: variable.parameter.function.latex
  - begin: ^(?=\\s*)
    end: ^\\s*(?=\\\\end\\{${envNameRegex}\\*?\\})
    contentName: ${source}
    patterns:
    - include: ${source}`

    return escapeBackSlash(yamlCode)
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

    const yamlCode = `- begin: (?:\\G|(?<=\\]))(\\{)(${languageRegex})(\\})
  beginCaptures:
   '1':
    name: punctuation.definition.arguments.begin.latex
   '2':
    name: variable.parameter.function.latex
   '3':
    name: punctuation.definition.arguments.end.latex
  end: ^\\s*(?=\\\\end\\{${envNameRegex}\\})
  contentName: ${contentName}
  patterns:
  - include: ${source}`

    return escapeBackSlash(yamlCode)
}

/**
 * Generate the json rules for a robust externalize type block
 * @param {string[]} envNames Typically CacheMeCode
 * @param {string[]} language A list of languages used to build an alternation
 * @param {string} source The source language to include
 * @param {string} contentName The scope to assign to the content. If undefined, use {@link source}
 */
function generateRobustExternalizeBlock(envNames, language, source, contentName=undefined) {
    if (contentName === undefined) {
        contentName = source
    }
    var languageRegex = '(?i:' + language.join('|') + ')'
    var envNameRegex = '(?:RobExt)?' + '(?:' + envNames.join('|') + ')'

    const yamlCode = `- begin: \\G(\\{)(?:__|[a-z\\s]*)${languageRegex}
  end: (?=\\\\end\\{${envNameRegex}\\})
  beginCaptures:
    '1':
      name: punctuation.definition.arguments.begin.latex
  patterns:
  - begin: \\G
    end: (\\})\\s*$
    endCaptures:
      '1':
        name: punctuation.definition.arguments.end.latex
    patterns:
    - include: text.tex#braces
    - include: $self
  - begin: ^(\\s*)
    end: ^\\s*(?=\\\\end\\{${envNameRegex}\\})
    contentName: ${contentName}
    patterns:
    - include: ${source}`

    return escapeBackSlash(yamlCode)
}

function buildLatexBlocks() {
    var mintedDefinitions = mintedLanguages.map(language => generateMintedBlock(mintedEnvs, language.language, language.source, language?.contentName)).join('\n')
    var codeDefinitions = codeLanguages.map(language => generateCodeBlock(language.name, language.source, language?.contentName)).join('\n')
    var robustExternalizeDefinitions = robustExternalizeLanguages.map(language => generateRobustExternalizeBlock(robustExternalizeEnvs, language.language, language.source, language?.contentName)).join('\n')

    try {
        let yamlGrammar = fs.readFileSync(path.join(syntaxesSrcDir, 'LaTeX.tmLanguage.base.yaml'), {encoding: 'utf-8'})
        yamlGrammar = yamlGrammar.replace(/^\s{2}- includeRobustExternalizeBlocks: ''/m, indent(2, robustExternalizeDefinitions))
        yamlGrammar = yamlGrammar.replace(/^- includeCodeBlocks: ''/m, codeDefinitions)
        yamlGrammar = yamlGrammar.replace(/^\s{2}- includeMintedblocks: ''/m, indent(2, mintedDefinitions))
        const latexGrammar = yaml.load(yamlGrammar)
        return latexGrammar
    } catch (error) {
        console.log(error)
    }
}

function buildDoctexGrammar(latexGrammar) {
    try {
        let doctexGrammar = fs.readFileSync(path.join(syntaxesSrcDir, 'DocTex.tmLanguage.yaml'), {encoding: 'utf-8'})
        const yamlGrammar = yaml.load(doctexGrammar)
        yamlGrammar['repository']['latexSource']['patterns'] = latexGrammar['patterns']
        yamlGrammar['repository'] = {...yamlGrammar['repository'], ...latexGrammar['repository']}
        return yamlGrammar
    } catch (error) {
        console.log(error)
    }
}


export function buildLatexGrammars() {
    const yamlGrammars = [
        'BibTeX-style.tmLanguage.yaml',
        'Bibtex.tmLanguage.yaml',
        'DocTeX.tmLanguage.yaml',
        'JLweave.tmLanguage.yaml',
        'Pweave.tmLanguage.yaml',
        'RSweave.tmLanguage.yaml',
        'TeX.tmLanguage.yaml'
    ]
    for (const yamlGrammar of yamlGrammars) {
        const jsonGrammar = path.basename(yamlGrammar, '.yaml') + '.json'
        console.log(`Generating ${jsonGrammar} from src/`)
        convertYamlToJson(path.join(syntaxesSrcDir, yamlGrammar), path.join(syntaxesDir, jsonGrammar))
    }

    console.log('Generating LaTeX.tmLanguage from src/')
    const latexGrammar = buildLatexBlocks()
    fs.writeFileSync(path.join(syntaxesDir, 'LaTeX.tmLanguage.json'), JSON.stringify(latexGrammar, undefined, 4))

    console.log('Generating DocTeX.tmLanguage from src/')
    const doctexGrammar = buildDoctexGrammar(latexGrammar)
    fs.writeFileSync(path.join(syntaxesDir, 'DocTeX.tmLanguage.json'), JSON.stringify(doctexGrammar, undefined, 4))
}

