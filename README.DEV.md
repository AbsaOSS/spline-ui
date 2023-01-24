#Spline UI Development Guide

---

##Application structure

- All shared stuff placed in the `/ui/projects` and separated into 4 main categories/libraries:

    - ###spline-api

      Represents DTO layer for the Spline consumer API.

    - ###spline-utils

      Generic stuff, which can be reused in any application. There cannot be any dependency on any other part of the
      application.

    - ###spline-common

      Generic UI related components/modules. These components can be reused in other applications. It can have
      dependencies on spline-utils.

    - ###spline-shared

      Spline UI application specific stuff. Smarter components/containers which need to be shared between application
      modules.
      It can have dependencies on spline-utils, spline-common, spline-api.


- Feature modules placed in the `/ui/src/modules`

  Each module can depend on any shared library from `/ui/projects`, but cannot have any dependencies on any other module
  from `/ui/src/modules` or `/ui/src/app`.


- AppModule, from `/ui/src/app` defines the skeleton of the application, it is a glue for the feature modules. It
  defines the application layout and routing, but it cannot have any dependencies on feature modules except routing
  definitions. It can be depended only on stuff from /ui/projects.

---

##The structure of shared libraries

```
    library-name
        main
            src
                public-api.ts
            
            assets
                i18n
                    library-name
                        en.json                    
            
            styles
                library-name
                    ...
                    index.scss
                library-name.scss
           
                
        secondary-endpoint            
            src
                public-api.ts
            assets
                i18n
                    library-name.secondary-endpoint
                        en.json                    
            
            styles
                library-name.secondary-endpoint
                    ...
                    index.scss
                library-name.secondary-endpoint.scss                
            package.json
            
        package.json             
```

- Each library has the main and secondary entry points:

    - Main entry point directory structure (all code in the directory `main` & the package.json should be at the level
      of the `main` directory)

        ```
            library-name
                main
                    assets
                    styles           
                    src
                        public-api.ts
                package.json             
        ```

    - Secondary entry point directory structure (package.json should be inside the secondary endpoint directive)
        ```
            library-name
                secondary-endpoint
                    assets
                    styles           
                    src
                        public-api.ts
                    package.json
        ```

- All SCSS files should be placed in the relevant `styles` directory instead of styles definition directly in the
  component with `styleUrls` property.
- All i18n files should be placed in the relevant i18n directory.

### Styles directory naming

1. Styles directory should contain the root (main entry) SCSS file & directory with the same name where all other files
   should be placed.

        projects/spline-common/data-view/styles:
            spline-common.data-view/
                ...
                index.scss
            spline-common.data-view.scss

   1.1 The name of the relevant entry file/directory is relevant to its placement in the `projects` directory, each
   directory level is separated with `.` in the file name. The main directory is it is the main entry point.

        projects/spline-common/main/styles:
            spline-common/
                ...
                index.scss
            spline-common.scss

        projects/spline-common/dynamic-filter/main/styles:
            spline-common.dynamic-filter/
                ...
                index.scss
            spline-common.dynamic-filter.scss

### Troubles-shooting

1. If during installation of dev dependencies you see next issue:

```
npm ERR! [FAILED] Error: unable to get local issuer certificate

```

You must follow one of 2 variants:

- Download root certificate (from Chrome browser) and export it it env variable:

```
export NODE_EXTRA_CA_CERTS=<path/to/certfile>
```

- Set npm config variable to state false (globally)

```
npm config set ssl-strict=false
```

2. If you've got the following error during npm packages installation

```
npm ERR! code ERR_SOCKET_TIMEOUT
```

Just increase the timeout for npm config:

```
npm config set fetch-retry-mintimeout 200000
npm config set fetch-retry-maxtimeout 1200000
```

3.

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
