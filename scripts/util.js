const fs = require('fs')
const path = require('path')

const src = path.resolve(__dirname, '../src')

module.exports.getEntry = () => {
  const files = fs.readdirSync(src)
  
  return files.reduce((pre, name) => {
    const entryKey = name.split('.styl')[0]
    return Object.assign({}, pre, {
      [entryKey]: path.resolve(src, name)
    })
  }, {})
}

module.exports.join = paths => path.join(__dirname, `../${paths}`)
