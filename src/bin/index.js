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
  .option('-i, --install', '安装CA证书')
  .option('-u, --uninstall', '卸载CA证书')
  .action((options) => {
    if (options.install) {
      cert.install()
    } else if (options.uninstall) cert.uninstall()
  })
program
  .command('serve <source>')
  .description('启动静态资源服务器')
  .option('-p, --port <port>', '启动端口', 443)
  .action((source, options) => {
    if (!options.port || !/^\d+$/.test(options.port)) throw new Error('你输入了错误的端口号')
    const option = { static: source, port: options.port }
    server.start(option)
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
