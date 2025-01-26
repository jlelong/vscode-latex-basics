const path = require('path')
const Mocha = require('mocha')
const { glob } = require('glob')

module.exports.run = function () {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd'
    })

    const testRoot = path.resolve(__dirname);
    return glob('**/*.test.js', { cwd: testRoot }).then(files => {
        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve(testRoot, f)))

        return new Promise((c, e) => {
            try {
                // Run the mocha test
                mocha.run(failures => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                })
            } catch (err) {
                console.error(err)
                e(err)
            }
        })
    }).catch(err => {
        console.error(err)
        throw err
    })
}
