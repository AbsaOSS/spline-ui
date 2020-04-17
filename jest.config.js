module.exports = {
    'preset': 'jest-preset-angular',
    'setupFilesAfterEnv': [
        '<rootDir>/setup-jest.ts'
    ],
    'transformIgnorePatterns': [
        'node_modules/(?!@ngrx)'
    ],
    'coverageReporters': [
        'text',
        'html',
        'cobertura'
    ],
    'moduleNameMapper': {
        "@core/(.*)": "<rootDir>/src/modules/core/$1",
        "/spline-api/": "<rootDir>/projects/spline-api/src/public-api",
        "^spline-api$": "<rootDir>/projects/spline-api/src/public-api",
        "/spline-common/": "<rootDir>/projects/spline-common/src/public-api",
        "^spline-common": "<rootDir>/projects/spline-common/src/public-api",
        "/spline-shared/": "<rootDir>/projects/spline-shared/src/public-api",
        "^spline-shared": "<rootDir>/projects/spline-shared/src/public-api",
    },
    'resolver': null,
    'globals': {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json'
        }
    }
};
