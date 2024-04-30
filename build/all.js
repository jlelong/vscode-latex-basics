import {bailout} from './generate-bailout.js'
import {latexMd} from './latex-md.js'
import {buildLatexGrammars} from './generate-latex-grammars.js'

const arg = process.argv[2]
if (arg === undefined || arg === 'build-latex') {
    /* Make sure to generate grammar blocks first */
    buildLatexGrammars()
}
if (arg === 'update-external' || arg === undefined) {
    bailout()
    latexMd()
}
