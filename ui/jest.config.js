/*
 * Copyright (c) 2020 ABSA Group Limited
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

module.exports = {
    'preset': 'jest-preset-angular',
    'setupFilesAfterEnv': [
        '<rootDir>/setup-jest.ts'
    ],
    'transformIgnorePatterns': [
        'node_modules/(?!@ngrx)'
    ],
    "testResultsProcessor": "jest-teamcity-reporter",
    'coverageReporters': [
        'text',
        'html',
        'cobertura',
        'teamcity'
    ],
    'moduleNameMapper': {
        "/spline-api/": "<rootDir>/projects/spline-api/src/public-api",
        "^spline-api$": "<rootDir>/projects/spline-api/src/public-api",
        "/spline-common/": "<rootDir>/projects/spline-common/src/public-api",
        "^spline-common": "<rootDir>/projects/spline-common/src/public-api",
        "/spline-shared/": "<rootDir>/projects/spline-shared/src/public-api",
        "^spline-shared": "<rootDir>/projects/spline-shared/src/public-api",
        "/spline-utils/": "<rootDir>/projects/spline-utils/src/public-api",
        "^spline-utils": "<rootDir>/projects/spline-utils/src/public-api",
    },
    'resolver': null,
    'globals': {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json'
        }
    }
};
