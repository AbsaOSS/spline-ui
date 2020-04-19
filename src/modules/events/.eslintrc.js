module.exports = {
    'rules': {
        '@angular-eslint/directive-selector': [
            'error',
            {
                'type': 'attribute',
                'prefix': ['event', 'events'],
                'style': 'camelCase'
            }
        ],
        '@angular-eslint/component-selector': [
            'error',
            {
                'type': 'element',
                'prefix': ['event', 'events'],
                'style': 'kebab-case'
            }
        ]
    }
};
