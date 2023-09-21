module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base',
    'plugin:prettier/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['prettier', 'import', '@typescript-eslint'],
  rules: {
    'no-debugger': 0,
    'no-console': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 1,
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/array-type': [
      'error',
      {
        'default': 'array'
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        'accessibility': 'explicit',
        'overrides': {
          'accessors': 'explicit',
          'constructors': 0,
          'methods': 'explicit',
          'properties': 'explicit',
          'parameterProperties': 'explicit'
        }
      }
    ],
    'max-lines-per-function': ['error', 40],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'object-curly-newline': [
      'error',
      {
        'ObjectExpression': { 'consistent': true, 'multiline': true },
        'ObjectPattern': { 'consistent': true, 'multiline': true },
        'ExportDeclaration': { 'multiline': true, 'minProperties': 3 }
      }
    ]
  },
  overrides: [
    {
      'files': ['*.ts'],
      'parserOptions': {
        'project': ['tsconfig.json']
      }
    }
  ],
};