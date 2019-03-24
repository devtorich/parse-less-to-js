const fs = require('fs')

const output = require('./output.js')

module.exports = function fileExists(opts, result, fileDir, filename) {
    const {
        outputFilename
    } = opts
    const outputFile = fileDir + '/' + outputFilename
    
    output(opts, outputFile, result, filename)
}
