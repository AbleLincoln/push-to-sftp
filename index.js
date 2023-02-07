const core = require('@actions/core')
const Client = require('ssh2-sftp-client')

const host = core.getInput('host')
const port = core.getInput('port')
const username = core.getInput('username')
const password = core.getInput('password')
const sourceDir = core.getInput('sourceDir')
const targetDir = core.getInput('targetDir')
const privateKey = core.getInput('privateKey')
const passphrase = core.getInput('passphrase')

core.info(`connecting to ${username}@${host}:${port}...`)

let sftp = new Client()

sftp.on('upload', ({ source, destination }) => {
  core.info(`uploaded ${source} to ${destination}`)
})

sftp
  .connect({
    host,
    port,
    username,
    password,
    privateKey,
    passphrase,
    readyTimeout: 5000,
    retries: 5,
  })
  .then(() => {
    core.info(`connected \n uploading ${sourceDir} to ${targetDir}...`)
    return sftp.uploadDir(sourceDir, targetDir)
  })
  .then(() => {
    core.info(`successfully uploaded ${sourceDir} to ${targetDir} 🎉`)
  })
  .catch((error) => {
    core.setFailed(error.message)
  })
  .finally(() => {
    core.info('ending SFTP session')
    sftp.end()
  })