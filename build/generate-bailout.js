const fs = require('fs')
const duplicateForEmbedding = require('textmate-bailout')
const vel = require('vscode-extend-language')

async function main() {
    console.log('Generating cpp bailed out grammar')
    duplicateForEmbedding({
        // url for json-version of a tmLanguage
        url: 'https://raw.githubusercontent.com/jeff-hykin/cpp-textmate-grammar/master/syntaxes/cpp.tmLanguage.json',
        appendScope: 'latex',
        bailoutPattern: '\\\\end\\{(?:minted|cppcode)\\}',
        newFileLocation: './syntaxes/cpp-grammar-bailout.tmLanguage.json'
    })

    const cppSyntaxUrl = 'https://raw.githubusercontent.com/microsoft/vscode/main/extensions/cpp/language-configuration.json'
    const cppEmbeddedSyntaxFile = './languages/latex-cpp-embedded-language-configuration.json'
    const res = await vel.download(cppSyntaxUrl)
    if (res) {
        fs.writeFileSync(cppEmbeddedSyntaxFile, res)
    } else {
        console.log('Cannot write the content of', cppSyntaxUrl)
    }
}

module.exports = main
