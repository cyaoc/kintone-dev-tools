const Hosts = require('hosts-so-easy')

module.exports.platform = require(`./${process.platform}`)

module.exports.platform.addDomainToHost = async (domians) => {
  const hosts = new Hosts()
  await hosts.updateFinish()
}

module.exports.platform.clearHosts = async () => {
  const hosts = new Hosts()
  hosts.clearQueue()
  await hosts.updateFinish()
}
