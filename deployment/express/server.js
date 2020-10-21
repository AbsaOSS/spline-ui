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

const compression = require('compression')
const express = require('express')
const yargs = require('yargs')
const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')
const path = require('path')

const argv = yargs
    .option(
        'port',
        {
            alias: 'p',
            description: 'Port',
            type: 'number'
        },
    )
    .option(
        'sources',
        {
            alias: 's',
            description: 'App sources directory',
            type: 'string'
        },
    )
    .option(
        'consumerApi',
        {
            alias: 'api',
            description: 'Consumer API path',
            type: 'string'
        },
    )
    .option(
        'compression',
        {
            alias: 'c',
            description: 'Consumer API path',
            type: 'boolean'
        },
    )
    .argv

// default params
const DEFAULT_PORT = 7070
const DEFAULT_SOURCES_DIR = __dirname + '/../../dist/spline-ui'
const DEFAULT_CONSUMER_API_URL = 'http://localhost:8080/consumer'

const PORT = argv.port ? argv.port : DEFAULT_PORT
const SOURCES_DIR = argv.sources ? argv.sources : DEFAULT_SOURCES_DIR
const API_PATH = argv.consumerApi ? argv.consumerApi : DEFAULT_CONSUMER_API_URL
const useCompression = argv.compression !== undefined ? argv.compression : true

// validation
if (!fs.existsSync(SOURCES_DIR)) {
    throw new Error(`Destination folder does not exist: ${SOURCES_DIR}`)
}

let app = express()

if (useCompression) {
    app.use(compression())
}

// API proxy settings
const apiProxy = createProxyMiddleware({
    target: API_PATH,
    pathRewrite: {
        '^/rest/consumer': ''
    },
    changeOrigin: true
})
app.use('/rest/consumer', apiProxy)

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

app.use('/', express.static(SOURCES_DIR, routingOptions))
app.use('/assets', express.static(path.join(SOURCES_DIR, 'assets'), staticOptions))
app.use('*', express.static(SOURCES_DIR, routingOptions))

app.listen(PORT)

console.info(`The app is running on port: http://localhost:${PORT}`)
