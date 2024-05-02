import {bailout} from './generate-bailout.mjs'
import {latexMd} from './latex-md.mjs'
import {buildLatexGrammars} from './generate-latex-grammars.mjs'

const arg = process.argv[2]
if (arg === undefined || arg === 'build-latex') {
    /* Make sure to generate grammar blocks first */
    buildLatexGrammars()
}
if (arg === 'update-external' || arg === undefined) {
    bailout()
    latexMd()
}
