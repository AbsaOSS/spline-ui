[![TeamCity build (develop)](https://teamcity.jetbrains.com/app/rest/builds/aggregated/strob:%28locator:%28buildType:%28id:OpenSourceProjects_AbsaOSS_SplineUi_AutomaticBuilds%29,branch:develop%29%29/statusIcon.svg)](https://teamcity.jetbrains.com/viewType.html?buildTypeId=OpenSourceProjects_AbsaOSS_SplineUi_AutomaticBuilds&branch=develop&tab=buildTypeStatusDiv)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=AbsaOSS_spline-ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=AbsaOSS_spline-ui)
[![SonarCloud Maintainability](https://sonarcloud.io/api/project_badges/measure?project=AbsaOSS_spline-ui&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=AbsaOSS_spline-ui)
[![SonarCloud Reliability](https://sonarcloud.io/api/project_badges/measure?project=AbsaOSS_spline-ui&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=AbsaOSS_spline-ui)
[![SonarCloud Security](https://sonarcloud.io/api/project_badges/measure?project=AbsaOSS_spline-ui&metric=security_rating)](https://sonarcloud.io/dashboard?id=AbsaOSS_spline-ui)

# Spline UI

## Config 

**The app config file required!** Config file should be placed in the directory: 
 - after build in the dist folder `/dist/spline-ui/assets/config.json` 
 - or before build `/src/assets/config.json` (that option also applies for the development)
 
 The example of the config can be found here: `/src/assets/example.json`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/spline-ui` directory.

## Deployment

### Docker

- Build a Docker image: `docker build -t spline-ui -f deployment/docker/Dockerfile .`
- Run the Docker image: `docker run -d --name spline-ui -p 7070:7070 spline-ui`  

---

### Express

That server can be used to serve the app artifacts at a specific port.
The default port and build artifacts directory path can be rewritten.
More details about Express server can be found here `/deployment/express/README.md`.

- First build the app if it is not already done: `npm run build`
- Go to the Express deployment directory: `cd deployment/express` 
- Install server dependencies (that step needed before the very first run): `npm ci` 
- Start the server: `npm start` 

**Note:** 

- Environment variables rewrites the app config file values.
- The app config file not required in that case. If config not provided the default config and environment vars will be used for the app configuration.

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
