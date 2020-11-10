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
const path = require('path')
const replace = require('buffer-replace')

const DEFAULT_PORT = 7070

const SPA_PREFIX = 'app' // no slashes in the beginning or in the end
const DEPLOY_CONTEXT_PLACEHOLDER = 'SPLINE_UI_DEPLOY_CONTEXT'
const DEPLOY_CONTEXT = ''

const serverPort = +(process.env.SPLINE_UI_PORT || DEFAULT_PORT)
const apiUrl = process.env.SPLINE_CONSUMER_URL
const uiConfigJson = {splineConsumerApiUrl: apiUrl}
const uiContentRoot = path.resolve(__dirname, process.env.UI_CONTENT_ROOT)

// validation
if (!apiUrl || /^\s*$/.test(apiUrl)) {
    throw new Error(`SPLINE_CONSUMER_URL should be specified`)
}
if (!(0 < serverPort && serverPort < 65535)) {
    throw new Error(`SPLINE_UI_PORT port should be in range [1-65535]: ${serverPort}`)
}

function serveIndexHtml(req, res) {
    fs.readFile(`${uiContentRoot}/${SPA_PREFIX}/index.html`, (err, data) => {
        res.contentType('text/html')
        res.send(replace(data, DEPLOY_CONTEXT_PLACEHOLDER, DEPLOY_CONTEXT))
    })
}

const app = express()

app.get(`/`, (_, res) => res.redirect(302, `/${SPA_PREFIX}`))
app.get(`/${SPA_PREFIX}/assets/config.json`, (_, res) => res.send(uiConfigJson))
app.use(`/${SPA_PREFIX}/assets`, express.static(`${uiContentRoot}/${SPA_PREFIX}/assets`))
app.use(`/${SPA_PREFIX}`, serveIndexHtml)
app.use(express.static(uiContentRoot))

app.listen(serverPort)

console.info(`Spline UI is running on http://localhost:${serverPort}`)
console.info(`Spline Consumer API URL: ${apiUrl}`)
