const fs = require('fs')

function lessToJsTemplate(opts, data) {
    const {
        mode
    } = opts

    switch (mode) {
        case 'commonjs':
            return `module.exports = ${data}`
        case 'json':
            return `${data}`
        case 'import':
            return `export default ${data}`

        default:
            return `export default ${data}`
    }
}

module.exports = function output(opts, outputFile, result, filename) {
    const js = lessToJsTemplate(opts, JSON.stringify(result))

    fs.open(outputFile, 'w', '0644', (err, res) => {
        if (err) throw err;

        fs.write(res, js, (err) => {
            if (err) throw err;
        })

        fs.close(res, (err) => {
            if (err) throw err

            console.log(`${filename}.less parse sucess!`)
        })
    })

}
