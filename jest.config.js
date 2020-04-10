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
    'moduleNameMapper': {},
    'resolver': null,
    'globals': {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json'
        }
    }
};
