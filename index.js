const core = require('@actions/core')
const Client = require('ssh2-sftp-client')

const host = core.getInput('host')
const port = core.getInput('port')
const username = core.getInput('username')
const password = core.getInput('password')
const sourceDir = core.getInput('sourceDir')
const targetDir = core.getInput('targetDir')

core.info(`connecting to ${username}@${host}:${port}...`)

let sftp = new Client()
sftp
  .connect({
    host,
    port,
    username,
    password,
  })
  .then(() => {
    core.info(`connected \n uploading ${sourceDir} to ${targetDir}...`)
    return sftp.uploadDir(sourceDir, targetDir)
  })
  .then(() => {
    core.info(`succesfully uploaded ${sourceDir} to ${targetDir} 🎉`)
  })
  .catch((error) => {
    core.setFailed(error.message)
  })
  .finally(() => {
    core.info('ending SFTP session')
    sftp.end()
  })