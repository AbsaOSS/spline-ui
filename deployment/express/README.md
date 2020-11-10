# Spline UI Express Server

Express server for a production deploying of Spline UI.


## The very first setup

- `npm ci`

## Start the express server 

- `node server.js`    

After that you can find the app running at the next address: http://localhost:7070. 


## server.js Environment variables

| Name        | Description           | Default value  |
| ------------- |-------------| -----:|
| `SPLINE_UI_PREFIX`      | The deployment URI prefix. | `app` |
| `SPLINE_UI_PORT`      | The port on which server will be running. | `7070` |
| `SPLINE_UI_SOURCES`      | The path to the root app directory.      |  `./spline-ui`  |


#### Example

Serving the app with custom settings 
 - port `9090`, 
 - custom directory `/path/to/the/splin-ui/` 
 - consumer API running at the custom uri `http://my-spline-instance.com/consumer`:

`set SPLINE_UI_PORT=9090 && set SPLINE_CONSUMER_URL=http://my-spline-instance.com/consumer&& set SPLINE_UI_SOURCES=/path/to/the/splin-ui/&& node server.js`

---

    Copyright 2020 ABSA Group Limited
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
