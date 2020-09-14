/*
 * Copyright 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { chdir } = require('process')
const { replaceInFileSync } = require('replace-in-file')
const { spawn, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { version } = require('../package.json')


const TARGET_DIR = path.resolve(__dirname, '../dist/spline-ui')
const SOURCE_DIR = __dirname

// check if directory with compiled files exists
if (!fs.existsSync(TARGET_DIR)) {
    throw new Error('Source directory does not exist.')
}


// copy package.json template && sync version from the main package.json
const packageJsonSourcePath = path.resolve(SOURCE_DIR, 'package.json')
const packageJsonTargetPath = path.resolve(TARGET_DIR, 'package.json')
fs.copyFileSync(packageJsonSourcePath, packageJsonTargetPath)

// copy README
const readmeSourcePath = path.resolve(SOURCE_DIR, 'README.md')
const readmeTargetPath = path.resolve(TARGET_DIR, 'README.md')
fs.copyFileSync(readmeSourcePath, readmeTargetPath)

const replaceVersionConfig = {
    files: TARGET_DIR + '/package.json',
    from: /VERSION/g,
    to: version,
}

replaceInFileSync(replaceVersionConfig)

// publish package to npm repo
chdir(TARGET_DIR)
const npmCmd = os.type().toLowerCase().includes('win')
    ? 'npm.cmd'
    : 'npm'

spawnSync(npmCmd, ['publish', '--access', 'public'])

const publishCmd = spawn(npmCmd, ['publish'])

// print cmd output
publishCmd.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
});

// clean up after publish finished
publishCmd.on('exit', (code) => {
    fs.unlinkSync(packageJsonTargetPath)
    fs.unlinkSync(readmeTargetPath)
});
