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

#!/usr/bin/env node
const compression = require('compression');
const express = require('express');
const yargs = require('yargs');
const proxy = require('express-http-proxy');

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
        'dist',
        {
            alias: 'd',
            description: 'Destination folder',
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
    .argv;

const DEFAULT_PORT = 7070;
const DEFAULT_DIST_PATH = __dirname + '/../dist/spline-ui';
const DEFAULT_CONSUMER_API = '/rest/consumer';

const PORT = argv.port ? argv.port : DEFAULT_PORT;
const DIST_PATH = argv.dist ? argv.dist : DEFAULT_DIST_PATH;
const API_PATH = argv.consumerApi ? argv.consumerApi : DEFAULT_CONSUMER_API;

console.log(API_PATH)

let app = express();

app.use(compression());

const options = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    index: 'index.html',
    lastModified: true,
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
        res.header('Cache-Control', 'public, max-age=1d');
    }
};

app.use('/', express.static(DIST_PATH, options));

app.use(DEFAULT_CONSUMER_API, proxy(API_PATH));

app.use('*', express.static(DIST_PATH, options));

app.listen(PORT);
