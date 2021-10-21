const inquirer = require('inquirer')
const fs = require('fs-extra')
const logger = require('../logger')

const validate = (err, msg) => {
  if (err) {
    logger.warn(` ${msg}`)
    return false
  }
  return true
}

const notEmpty = (input) => {
  return validate(!input || input.length === 0, 'Can not be empty')
}

const answer = async (questions, target) => {
  for (let i = questions.length - 1; i >= 0; i -= 1) {
    if (target[questions[i].name]) questions.splice(i, 1)
  }
  if (questions.length > 0) {
    const answers = await inquirer.prompt(questions)
    return answers
  }
  return {}
}

module.exports = class Env {
  constructor(file) {
    this.file = file
  }

  async load(expends = []) {
    const configuration = fs.existsSync(this.file) ? require(this.file) : { env: {} }
    const exp = Array.isArray(expends) ? expends : [expends]
    Object.assign(
      configuration.env,
      await answer(
        [
          {
            type: 'input',
            message: 'Please enter hostname',
            name: 'host',
            validate: notEmpty,
          },
          {
            type: 'input',
            message: 'Please enter user name',
            name: 'username',
            validate: notEmpty,
          },
          {
            type: 'password',
            message: 'Please enter password',
            name: 'password',
            validate: notEmpty,
          },
        ].concat(exp),
        configuration.env,
      ),
    )

    return configuration
  }

  save(configuration) {
    fs.outputFileSync(this.file, `module.exports = ${JSON.stringify(configuration, null, 2)}`)
  }
}
