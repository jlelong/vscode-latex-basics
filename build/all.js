const bailout = require('./generate-bailout')
const md = require('./latex-md')
const codeblocks = require('./generate-grammar-blocks')

/* Make sure to generate grammar blocks first */
codeblocks()
bailout()
md()
