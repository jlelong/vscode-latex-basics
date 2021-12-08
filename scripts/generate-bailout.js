const duplicateForEmbedding = require('textmate-bailout')
const got = require('got')
const fs = require('fs')

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

async function main() {
    duplicateForEmbedding({
        // url for json-version of a tmLanguage
        url: 'https://raw.githubusercontent.com/jeff-hykin/cpp-textmate-grammar/master/syntaxes/cpp.tmLanguage.json',
        appendScope: 'latex',
        bailoutPattern: '\\\\end\\{(?:minted|cppcode)\\}',
        newFileLocation: './syntaxes/cpp-grammar-bailout.tmLanguage.json'
    })

    const cppSyntaxUrl = 'https://raw.githubusercontent.com/microsoft/vscode/main/extensions/cpp/language-configuration.json'
    const cppEmbeddedSyntaxFile = './languages/latex-cpp-embedded-language-configuration.json'
    const res = await downloadUrl(cppSyntaxUrl)
    if (res) {
        fs.writeFileSync(cppEmbeddedSyntaxFile, res)
    }
}

module.exports = main
