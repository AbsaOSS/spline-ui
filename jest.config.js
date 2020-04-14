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
        "/spline-api/": "../projects/spline-api/src/public-api",
        "^spline-api$": "../projects/spline-api/src/public-api",
    },
    'resolver': null,
    'globals': {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json'
        }
    }
};
