const path = require('path')
const fs = require('fs-extra')
const logger = require('../logger')

const configFile = '.devtoolsrc.js'

module.exports = class Config {
  constructor(dir) {
    this.dir = dir
    this.file = path.resolve(this.dir, configFile)
    if (!fs.existsSync(this.file)) {
      const template = `module.exports = {
    env: {
      host: '',
      username: '',
      password: '',
    },
    map: [
      { type: 'app', appid: 1, folder: 'xxx', upload: 'desktop', ignore: ['xxx.js'] },
      { type: 'portal', src: ['test/xxx.js'] },
    ]
  }`
      fs.outputFileSync(this.file, template)
      logger.info('未找到配置文件，目前已重新生成，请进行配置')
    }
  }

  isConfig(file) {
    return this.file === file
  }

  reload() {
    delete require.cache[this.file]
    this.load()
  }

  load() {
    const config = require(this.file)
    this.env = config.env
    this.map = new Map()
    this.ignore = new Set()

    config.map.forEach((el) => {
      const folder = el.folder ? (path.isAbsolute(el.folder) ? el.folder : path.resolve(this.dir, el.folder)) : this.dir

      const value = {}
      if (el.appid && el.appid > 0) value.appid = el.appid
      value.upload = (el.upload ? (Array.isArray(el.upload) ? el.upload : [el.upload]) : ['mobile', 'desktop']).map(
        (e) => e.toUpperCase(),
      )

      if (el.src) {
        const arr = Array.isArray(el.src) ? el.src : [el.src]
        arr.forEach((e) => this.map.set(path.isAbsolute(e) ? e : path.resolve(folder, e), value))
      } else {
        this.map.set(folder, value)
      }

      if (el.ignore) {
        const arr = Array.isArray(el.ignore) ? el.ignore : [el.ignore]
        arr.forEach((e) => this.ignore.add(path.isAbsolute(e) ? e : path.resolve(folder, e)))
      }
    })
  }

  convert(file, isDir = false) {
    if (file === this.dir) return undefined
    const dir = path.dirname(file)
    const value = isDir ? this.map.get(dir) : this.map.get(file) || this.map.get(dir)
    if (value) return value
    return this.convert(dir, true)
  }
}
