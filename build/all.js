const bailout = require('./generate-bailout')
const md = require('./latex-md')
const buildLatexGrammars = require('./generate-latex-grammars')

const arg = process.argv[2]
if (arg === undefined || arg === 'build-latex') {
    /* Make sure to generate grammar blocks first */
    buildLatexGrammars()
}
if (arg === 'update-external' || arg === undefined) {
    bailout()
    md()
}
