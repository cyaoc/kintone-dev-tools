#! /usr/bin/env node
const { program } = require('commander')
const pkg = require('../pkg')
const cert = require('../cert')
const server = require('../server')
const Watcher = require('../watch')

program.version(pkg.version, '-v, --version').description(pkg.description)
program
  .command('cert')
  .description('生成开发用的服务器证书')
  .option('-i, --install')
  .option('-u, --uninstall')
  .action((options) => {
    if (options.install) {
      cert.install()
    } else if (options.uninstall) cert.uninstall()
  })
program
  .command('serve <source>')
  .description('启动静态资源服务器')
  .action((source) => {
    server.start(source)
  })
program
  .command('watch <source>')
  .description('监听文件夹，发现文件变更后自动上传文件')
  .action(async (source) => {
    const watcher = new Watcher(source)
    await watcher.init()
    watcher.start()
  })
program.parse(process.argv)
