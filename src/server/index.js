const https = require('https')
const express = require('express')
const serveIndex = require('serve-index')
const { certificateFor } = require('../cert')
const logger = require('../logger')

module.exports.start = (dir) => {
  logger.info('正在配置开发者证书')
  const cert = certificateFor()
  const app = express()
  app.use('/', express.static(dir), serveIndex(dir, { icons: true }))

  const httpsServer = https.createServer(
    {
      key: cert.private,
      cert: cert.cert,
    },
    app,
  )
  httpsServer.listen(443)
  logger.info('服务器已经启动 https://localhost')
}
