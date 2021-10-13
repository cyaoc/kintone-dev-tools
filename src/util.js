const path = require('path')

module.exports.path = (source) => (path.isAbsolute(source) ? source : path.resolve(process.cwd(), source))
module.exports.path = (source, file) => path.resolve(this.path(source), file)
