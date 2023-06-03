/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
'use strict'

const assert = require('assert')
const { commands, Uri } = require('vscode')
const { join, basename, normalize, dirname } = require('path')
const fs = require('fs')

function assertUnchangedTokens(testFixurePath, done) {
    let fileName = basename(testFixurePath)

    return commands.executeCommand('_workbench.captureSyntaxTokens', Uri.file(testFixurePath)).then(data => {
        try {
            if (!Array.isArray(data)) {
                throw Error('Syntax token result is not an array')
            }
            data = data.map((value) => { return {c: value.c, t: value.t}})
            let resultsFolderPath = join(dirname(dirname(testFixurePath)), 'colorize-results')
            if (!fs.existsSync(resultsFolderPath)) {
                fs.mkdirSync(resultsFolderPath)
            }
            let resultPath = join(resultsFolderPath, fileName.replace('.', '_') + '.json')
            if (fs.existsSync(resultPath)) {
                let previousData = JSON.parse(fs.readFileSync(resultPath).toString())
                try {
                    assert.deepEqual(data, previousData)
                } catch (e) {
                    // fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'), { flag: 'w' })
                    if (Array.isArray(data) && Array.isArray(previousData) && data.length === previousData.length) {
                        for (let i = 0; i < data.length; i++) {
                            let d = data[i]
                            let p = previousData[i]
                            if (d.c !== p.c || p.t !== d.t) {
                                console.log('expected: ' + JSON.stringify(p))
                                console.log('actual: ' + JSON.stringify(d))
                                throw e
                            }
                        }
                        // different but no tokenization ot color change: no failure
                    } else {
                        throw e
                    }
                }
            } else {
                fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'))
            }
            done()
        } catch (e) {
            done(e)
        }
    }, done)
}

function hasThemeChange(d, p) {
    let keys = Object.keys(d)
    for (let key of keys) {
        if (d[key] !== p[key]) {
            return true
        }
    }
    return false
}

suite('colorization', () => {
    let extensionColorizeFixturePath = join(__dirname, 'colorize-fixtures')
    if (fs.existsSync(extensionColorizeFixturePath)) {
        let fixturesFiles = fs.readdirSync(extensionColorizeFixturePath).filter(f => f.endsWith('.tex') || f.endsWith('.bib'))
        fixturesFiles.forEach(fixturesFile => {
            // define a test for each fixture
            test(fixturesFile, (done) => {
                assertUnchangedTokens(join(extensionColorizeFixturePath, fixturesFile), done)
            })
        })
    }
})
