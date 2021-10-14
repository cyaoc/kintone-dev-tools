const https = require('https')
const express = require('express')
const serveIndex = require('serve-index')
const ip = require('ip')
const { certificateFor } = require('../cert')
const logger = require('../logger')

module.exports.start = (option) => {
  logger.info('正在配置开发者证书')
  const myip = ip.address()
  const cert = certificateFor(myip)
  const app = express()
  app.use('/', express.static(option.static), serveIndex(option.static, { icons: true }))
  const httpsServer = https.createServer(
    {
      key: cert.private,
      cert: cert.cert,
    },
    app,
  )
  httpsServer.listen(option.port ? option.port : 443)
  logger.info('服务器已经启动,你可以通过以下链接来访问:')
  const port = !option.port || option.port === 443 ? '' : `:${option.port}`
  logger.info(`本地 -> https://localhost${port}/`)
  logger.info(`局域网 -> https://${myip}${port}/`)
}
