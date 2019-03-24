const parse = require('../src/index').parse
const dir = './example/style/'

parse({
    lessFile: dir + 'index.less',
    outputFilename: 'color.js',
    mode: 'import',
    // ignore: false
})
