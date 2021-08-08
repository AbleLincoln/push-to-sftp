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

let client = new Client()

/**
 * Escapes any special characters in our file list (primarily `/`, `.`) to prepare for RegExp
 * @param {string} string string
 * @returns string
 */
function regExpEscape(string) {
  return string.replace(/[-\/\\$.()[\]{}]/g, '\\$&')
}

/**
 * Creates a RegExp to match all files in list
 * @param {string[]} filenames List of filenames
 * @returns RegExp
 */
function createFilenamesRegExp(filenames) {
  const escapedStr = regExpEscape(filenames.join('|'))
  return new RegExp(`(${escapedStr})`, 'g')
}

async function run() {
  let re

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

    const {
      data: { files },
    } = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead,
    })

    const modifiedFiles = files.map(({ filename }) => filename)

    core.info(modifiedFiles)

    re = createFilenamesRegExp(modifiedFiles)

    console.log(re.toString())
  }

  try {
    core.info(`connecting to ${username}@${host}:${port}...`)
    await client.connect({
      host,
      port,
      username,
      password,
      readyTimeout: 5000,
      retries: 5,
    })

    client.on('upload', (info) => {
      core.info(`Listener: Uploaded ${info.source} to ${info.destination}`)
    })

    core.info(`connected \n uploading ${sourceDir} to ${targetDir}...`)

    await client.uploadDir(onlyModifiedFiles ? './' : sourceDir, targetDir, re)

    core.info(`succesfully uploaded ${sourceDir} to ${targetDir} 🎉`)
  } catch (error) {
    throw error // caught in parent scope
  } finally {
    core.info('ending SFTP session')
    client.end()
  }
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
} 