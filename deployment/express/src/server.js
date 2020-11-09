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

const express = require('express')
const fs = require('fs')
const replace = require('buffer-replace')

// default params
const DEFAULT_PREFIX = 'app' // no slashes in the beginning or in the end
const DEFAULT_PORT = 7070
const DEFAULT_SOURCES_DIR = __dirname + '/spline-ui'
const DEPLOY_CONTEXT_PLACEHOLDER = "SPLINE_UI_DEPLOY_CONTEXT"
const DEPLOY_CONTEXT = ""

const appPrefix = process.env.SPLINE_UI_PREFIX || DEFAULT_PREFIX
const serverPort = process.env.SPLINE_UI_PORT || DEFAULT_PORT
const contentRoot = process.env.SPLINE_UI_SOURCES || DEFAULT_SOURCES_DIR

const configJson = {splineConsumerApiUrl: "https://opensource.bigusdatus.com/spline/rest/consumer"}

// validation
if (!fs.existsSync(contentRoot)) {
    throw new Error(`Destination folder does not exist: ${contentRoot}`)
}

function serveIndexHtml(req, res) {
    fs.readFile(`${contentRoot}/${appPrefix}/index.html`, (err, data) => {
        res.contentType("text/html")
        res.send(replace(data, DEPLOY_CONTEXT_PLACEHOLDER, DEPLOY_CONTEXT))
    })
}

const app = express()

app.use(`/${appPrefix}/assets`, express.static(`${contentRoot}/${appPrefix}/assets`))
app.use(`/${appPrefix}/assets/config.json`, (req, res) => res.send(configJson))
app.use(`/${appPrefix}`, serveIndexHtml)
app.use(`/${appPrefix}/*`, serveIndexHtml)
app.use(express.static(contentRoot))

app.listen(serverPort)
