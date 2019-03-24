const dir = './test/style/'
const assert = require('assert')
const parse = require('../src/index').parse

describe('less2js', function () {

    it('not return', function () {

        assert (parse({
            lessFile: dir + 'index.less',
            outputFilename: 'color.js',
            mode: 'import'
        }) == undefined)
    })
})
