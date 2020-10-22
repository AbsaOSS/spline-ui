# Spline UI

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/spline-ui` directory.

## Deployment

### Docker

- Build a Docker image: `docker build -t spline-ui -f deployment/docker/Dockerfile .`
- Run the Docker image: `docker run -d --name spline-ui -p 7070:7070 spline-ui`  

### Express

That server can be used to serve the app artifacts at a specific port.
The default port and build artifacts directory path can be rewritten.
More details about Express server can be found here `/deployment/express/README.md`.

- First build the app if it is not already done: `npm run build:prod`
- Go to the Express deployment directory: `cd deployment/express` 
- Install server dependencies (that step needed before the very first run): `npm install` 
- Start the server: `npm start` 

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
