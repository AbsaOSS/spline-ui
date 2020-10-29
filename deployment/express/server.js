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


// default params
const DEFAULT_PREFIX = 'app' // no slashes in the beginning or in the end
const DEFAULT_PORT = 7070
const DEFAULT_SOURCES_DIR = __dirname + '/../../dist/spline-ui'
const DEFAULT_CONSUMER_API_URL = 'http://localhost:8080/consumer'

const PREFIX = process.env.SPLINE_UI_PREFIX || DEFAULT_PREFIX
const PORT = process.env.SPLINE_UI_PORT || DEFAULT_PORT
const API_PATH = process.env.SPLINE_UI_CONSUMER_API || DEFAULT_CONSUMER_API_URL
const SOURCES_DIR = process.env.SPLINE_UI_SOURCES || DEFAULT_SOURCES_DIR


// validation
if (!fs.existsSync(SOURCES_DIR)) {
    throw new Error(`Destination folder does not exist: ${SOURCES_DIR}`)
}

let app = express()

const baseOptions = {
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
        res.header('Cache-Control', 'public, max-age=1d')
    }
}

const routingOptions = {
    ...baseOptions,
    extensions: ['htm', 'html'],
    index: 'index.html',
}

const staticOptions = {
    ...baseOptions,
    extensions: ['htm', 'html', 'js', 'css', 'ttf'],
    index: false,
    fallthrough: false
}

// rewrite config response according to the env settings.
app.use(`/${PREFIX}/assets/config.json`, (req, res) => {
    const configFilePath = path.join(DEFAULT_SOURCES_DIR, 'assets', 'config.json')
    // read default settings from file
    const config = JSON.parse(fs.readFileSync(configFilePath))
    // rewrite API path
    config.splineConsumerApiUrl = API_PATH
    // return new config with env settings
    res.setHeader('Content-type', 'application/json')
    res.end(JSON.stringify(config))
})

// assets
app.use(`/${PREFIX}/assets`, express.static(path.join(SOURCES_DIR, 'assets'), staticOptions))
// routing

app.use(`/${PREFIX}`, express.static(SOURCES_DIR, routingOptions))
app.use(`/${PREFIX}/`, express.static(SOURCES_DIR, routingOptions))
app.use(`/${PREFIX}/*`, express.static(SOURCES_DIR, routingOptions))
// scripts & styles
app.use('/:file', (req, res) => {
    fs.readFile(path.join(SOURCES_DIR, req.params.file), function(err, data) {
        if(err) {
            res
                .status(404)
                .send("Not found!");
        } else {
            // set the content type based on the file path
            res.contentType(req.params.file);
            res.send(data);
        }
        res.end();
    });
})

app.listen(PORT)

console.info(`The app is running on port: http://localhost:${PORT}/${PREFIX}`)
console.info(`Consumer API URI: ${API_PATH}`)
