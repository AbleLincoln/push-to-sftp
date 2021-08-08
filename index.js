const core = require('@actions/core')
const github = require('@actions/github')
const Client = require('ssh2-sftp-client')

const host = core.getInput('host')
const port = core.getInput('port')
const username = core.getInput('username')
const password = core.getInput('password')
const sourceDir = core.getInput('sourceDir')
const targetDir = core.getInput('targetDir')
const onlyModifiedFiles = core.getInput('onlyModifiedFiles')

let sftp = new Client()

async function run() {
  if (onlyModifiedFiles) {
    core.info('getting modified files...')
    const myToken = core.getInput('myToken')
    const myTolkien = github.context.token
    core.info(`tokens: ${myToken} ${myTolkien}`)
  }

  core.info(`connecting to ${username}@${host}:${port}...`)

  await sftp.connect({
    host,
    port,
    username,
    password,
    readyTimeout: 5000,
    retries: 5,
  })

  core.info(`connected \n uploading ${sourceDir} to ${targetDir}...`)

  await sftp.uploadDir(sourceDir, targetDir)

  core.info(`succesfully uploaded ${sourceDir} to ${targetDir} 🎉`)
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
} finally {
  core.info('ending SFTP session')
  sftp.end()
}