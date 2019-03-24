const fs = require('fs');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import')

const fileExists = require('./file-exists.js')

let result = {}
let fileDirs = []

let base = {}
let imports = {}

less.functions.functionRegistry.add('_less2js', function (name, value) {

    result[name.value] = value.toCSS()
});

let parsedLess = []

function parse(opts) {

    const {
        lessFile,
        outputFilename,
        // ignore
    } = opts

    fs.readFile(lessFile, function (err, text) {

        if (err) throw err

        if (lessFile.match(/\.(less)$/g) == '.less') {
            let lessReg = new RegExp(/\@.+\:+/g)
            // less 变量名
            const varibles = String(text).trim().match(lessReg).map(v => v.slice(1).split(':')[0].trim())
            // less 文件路径
            const fileDir = lessFile.split('/').slice(0, lessFile.split('/').length - 1).join('/')
            fileDirs.push(fileDir)
            let filenameReg = new RegExp(/(.(?!\/))+\.(less)$/g)
            // less 文件名
            const filename = lessFile.match(filenameReg).map(n => n.slice(1).toString().split(".")[0]).toString()

            let transforms = [];
            varibles.map((varible, i) => {
                // 自定义编译函数
                let source = '#prefix { value: _less2js(' + varible + ', @' + varible + ');}\n' + String(text);


                const transform = less.render(source, {
                    filename: lessFile,
                    lint: true,
                    async: false,
                    fileAsync: true,
                    javascriptEnabled: true,
                    plugins: [new NpmImportPlugin({
                        prefix: '~'
                    })]
                });

                transforms.push(transform)
            });

            Promise.all(transforms).then(res => {

                if (!parsedLess.includes(lessFile)) {
                    // const fileImports = ignore ? res.imports.filter(file => !file.match(/(node_modules)/g)) : res.imports
                    const fileImports = res[0].imports.filter(file => !file.match(/(node_modules)/g))

                    fileImports.forEach(file => {
                        file = file.replace(/\\/g, '/')

                        parsedLess.push(file)

                        parse({
                            lessFile: file,
                            outputFilename
                        })
                    })
                    // 目标目录是第一次的目录

                    Object.keys(varibles).map((r, i) => {

                        const camelCaseName = varibles[i].replace(/\-(\w)/g, function (all, letter) {
                            return letter.toUpperCase();
                        })

                        base[varibles[i]] = result[varibles[i]]
                        base[camelCaseName] = result[varibles[i]]
                    })

                    fileExists(opts, Object.assign(base, imports), fileDirs[0], filename)
                } else {

                    Object.keys(varibles).map((r, i) => {

                        const camelCaseName = varibles[i].replace(/\-(\w)/g, function (all, letter) {
                            return letter.toUpperCase();
                        })

                        imports[varibles[i]] = result[varibles[i]]
                        imports[camelCaseName] = result[varibles[i]]
                    })

                    fileExists(opts, Object.assign(base, imports), fileDirs[0], filename)
                }
            })
        } else {
            console.error('input file is not a less file!')
        }
    })
}

module.exports = {
    parse
}
