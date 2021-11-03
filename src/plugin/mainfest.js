const fs = require('fs-extra')

module.exports.parse = (json, change) => {
  const manifest = JSON.parse(fs.readFileSync(json))
  const keys = ['desktop', 'mobile', 'config']
  keys.forEach((key) => {
    if (manifest[key]) {
      Object.keys(manifest[key]).forEach((type) => {
        if (manifest[key][type]) {
          manifest[key][type] = Array.isArray(manifest[key][type]) ? manifest[key][type] : [manifest[key][type]]
          for (let i = manifest[key][type].length - 1; i >= 0; i -= 1) {
            const value = change(manifest[key][type][i], type)
            if (value !== undefined) {
              manifest[key][type][i] = value
            } else {
              manifest[key][type].splice(i, 1)
            }
          }
        }
      })
    }
  })
  return manifest
}
