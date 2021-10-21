const path = require('path')
const fs = require('fs-extra')
const logger = require('../logger')
const { Env } = require('../kintone')

const configFile = '.devtoolsrc.js'

module.exports = class Config extends Env {
  constructor(dir) {
    super(path.resolve(dir, configFile))
    this.dir = dir
  }

  isConfig(file) {
    return this.file === file
  }

  async reload() {
    delete require.cache[this.file]
    await this.load()
  }

  async load() {
    const config = await super.load()
    this.env = config.env
    if (!fs.existsSync(this.file)) {
      config.map = [
        { type: 'portal', folder: '.', ignore: ['ignore.js'] },
        { type: 'app', appid: 1, src: ['app.js'], upload: 'desktop' },
      ]
      super.save(config)
      logger.info(
        'The configuration file has been generated, please manually set the mapping relationship between file and app',
      )
    }
    this.map = new Map()
    this.ignore = new Set()

    config.map.forEach((el) => {
      const folder = el.folder ? (path.isAbsolute(el.folder) ? el.folder : path.resolve(this.dir, el.folder)) : this.dir

      const value = {}
      if (el.appid && el.appid > 0) value.appid = el.appid
      value.upload = (el.upload ? (Array.isArray(el.upload) ? el.upload : [el.upload]) : ['desktop', 'mobile']).map(
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

  convert(file) {
    const value = this.map.get(file)
    if (value) return value
    if (file === this.dir) return undefined
    return this.convert(path.dirname(file))
  }
}
