const fs = require('fs-extra')

module.exports.emptyDirSync = (dir) => {
  fs.emptyDirSync(dir)
}

module.exports.copySync = (source, target) => {
  fs.copySync(source, target)
}

module.exports.outputSync = (target, datas, options = {}) => {
  const opts = options
  opts.clean = Object.prototype.hasOwnProperty.call(opts, 'clean') ? opts.clean : false
  if (opts.clean) fs.emptyDirSync(target)
  fs.outputFileSync(target, datas)
}
