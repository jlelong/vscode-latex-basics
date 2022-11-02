const bailout = require('./generate-bailout')
const md = require('./latex-md')
const codeblocks = require('./generate-grammar-blocks')

const arg = process.argv[2]
if (arg === undefined || arg === 'build-latex') {
    /* Make sure to generate grammar blocks first */
    codeblocks()
}
if (arg === 'update-external' || arg === undefined) {
    bailout()
    md()
}
