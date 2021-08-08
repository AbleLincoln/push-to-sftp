const core = require('@actions/core')
const { getOctokit, context } = require('@actions/github')
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

    const token = core.getInput('token')
    const octokit = getOctokit(token)
    const {
      payload: { before, after },
      repo: { owner, repo },
    } = context
    const base = before
    const head = after
    const basehead = `${base}...${head}`

    core.info(`${owner} ${repo} ${basehead}`)

    const resp = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead,
    })

    core.info(resp)

    return
  }

  try {
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
  } catch (error) {
    throw error // caught in parent scope
  } finally {
    core.info('ending SFTP session')
    sftp.end()
  }
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
} 