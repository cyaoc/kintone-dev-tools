const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs-extra')
const Config = require('./config')
const DB = require('./db')
const Client = require('../client')
const logger = require('../logger')

module.exports = class Watcher {
  constructor(source) {
    this.source = source
    const dir = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source)
    this.config = new Config(dir)
    this.db = new DB(dir)
  }

  async init() {
    logger.info('加载配置中。。。。。')
    this.config.load()
    this.clinet = new Client(this.config.env)
    await this.db.init()
  }

  start() {
    logger.info('启动监听中。。。。。')
    chokidar
      .watch(this.source, {
        ignored: (file) => {
          const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
          const ext = path.extname(fpath)
          const flg = fs.existsSync(fpath) ? fs.lstatSync(fpath).isFile() : true
          const ignored = this.config.ignore.has(fpath) || (flg && ext !== '.js' && ext !== '.css')
          if (ignored) logger.info(`文件${file}已忽略处理`)
          return ignored
        },
        ignoreInitial: true,
      })
      .on('add', (file) => {
        logger.info(`新增文件:${file}`)
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        this.db.add(fpath)
        this.upload(fpath, this.config.convert(fpath))
      })
      .on('change', (file) => {
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        if (this.db.change(fpath)) {
          logger.info(`文件:${file}已变更`)
          if (this.config.isConfig(fpath)) {
            logger.info('重载配置文件中。。。。。')
            this.config.reload()
            this.clinet = new Client(this.config.env)
            return
          }
          this.upload(fpath, this.config.convert(fpath))
        }
      })
      .on('unlink', async (file) => {
        logger.info(`文件:${file}已被删除`)
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        this.db.remove(fpath)
      })
  }

  upload(file, value) {
    if (value) {
      logger.info(`开始上传文件到${value.appid ? `App : ${value.appid}` : `portal`}`)
      this.clinet.customizeFiles([file], value.upload, value.appid)
    } else {
      logger.warn('未找到相应配置')
    }
  }
}
