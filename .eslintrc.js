module.exports = {
    'env': {
        'es6': false,
        'node': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 3,
        'sourceType': 'module'
    },
    'plugins': [
        // 'jsdoc'
    ],
    'rules': {
        'no-invalid-this': 2,
        'no-unused-vars': 1,
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};