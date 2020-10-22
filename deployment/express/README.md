# Spline UI Express Server

Express server for a production deploying of Spline UI.


## The very first setup

- `npm install`

## Start the express server 

- `node server.js`    

After that you can find the app running at the next address: http://localhost:7070. 


## server.js Environment variables

| Name        | Description           | Default value  |
| ------------- |-------------| -----:|
| `PORT`      | The port on which server will be running. | `7070` |
| `SOURCES`      | The path to the root app directory.      |  `../../dist/spline-ui`  |
| `CONSUMER_API` | Spline Consumer API URI.      |    `http://localhost:8080/consumer` |


#### Example

Serving the app at the custom port `9090`, from the custom directory `/path/to/the/splin-ui/` and consumer API running at the custom uri `http://my-spline-instance.com/consumer`:

`set PORT=9090 && set CONSUMER_API=http://my-spline-instance.com/consumer&& set SOURCES=/path/to/the/splin-ui/&& node server.js`

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
