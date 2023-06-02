/* eslint-env node */

const isProd = process.env.NODE_ENV === 'production'
const runInProd = config => !isProd ? 'off' : config

const rules = {
  eslint: {
    'no-case-declarations': 'off',
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/no-duplicates': 'off',
    'no-async-promise-executor': 'off',
    'block-spacing': 'error',
    'import/named': 'off',
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'never' ],
    'curly': 2,
    'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
    'no-throw-literal': 'off',
    'array-bracket-spacing': [
      'error',
      'always',
      {
        'singleValue': true,
        'objectsInArrays': true,
        'arraysInArrays': true,
      },
    ],
    'camelcase': [
      'error',
      {
        'properties': 'always',
      },
    ],
    'arrow-spacing': [ 'error', { 'before': true, 'after': true } ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': [ 'error', { 'after': true } ],
    'space-in-parens': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'func-call-spacing': [ 'error', 'never' ],
    'computed-property-spacing': [ 'error', 'always' ],
    'key-spacing': [ 'error', { afterColon: true, mode: 'strict' } ],
    'template-curly-spacing': [ 'error', 'always' ],
    'keyword-spacing': [ 'error', { before: true, after: true } ],
    'operator-assignment': [ 'error', 'always' ],
    'no-var': 'error',
    'func-style': 'error',
    'no-console': [
      'error',
      { 'allow': [ 'warn', 'trace', 'group', 'groupEnd' ] },
    ],
    'eol-last': [ 'error', 'always' ],
  },
  prefixBlocks: {
    'import': {
      prefix: 'import',
      rules: {
        'export': 'error',
        'first': 'error',
        'extensions': 'off',
        'no-self-import': 'error',
        'no-unresolved': 'error',
        'no-useless-path-segments': [
          'error',
          {
            noUselessIndex: true,
          },
        ],
        'order': 0,
        'no-cycle': runInProd( 'error' ),
        'no-deprecated': runInProd( 'warn' ),
        'no-unused-modules': runInProd( 'error' ),
        'no-named-as-default': runInProd( 'error' ),
      },
    },

    'typescript': {
      prefix: '@typescript-eslint',
      rules: {
        'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
        'no-unused-vars': 'error',
        'member-delimiter-style': 'error',
        'member-ordering': 'error',
        'type-annotation-spacing': 'error',
      },
    },
  },

}

const addPrefixesToRules = () => {
  const prefixedRules = {}

  for ( const prefixBlock of Object.keys( rules.prefixBlocks ) ) {
    const { prefix, rules: notPrefixedRules } = rules.prefixBlocks[ prefixBlock ]

    const prefixedBlockRules = {}
    Object.keys( notPrefixedRules ).forEach(
      ( rule ) => {
        const prefixedRule = `${ prefix }/${ rule }`
        prefixedBlockRules[ prefixedRule ] = notPrefixedRules[ rule ]
      },
    )

    prefixedRules[ prefixBlock ] = prefixedBlockRules
  }

  return prefixedRules
}

const readyRules = {
  eslint: rules.eslint,
  ...addPrefixesToRules(),
}

const eslint = {
  root: true,
  env: {
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
  ],
  plugins: [
    'import',
    'promise',
  ],
  rules: {
    ...readyRules[ 'eslint' ],
    ...readyRules[ 'import' ],
  },
  settings: {
    'import/ignore': [],
    'import/extensions': [ '.js', '.jsx', '.ts', '.tsx' ],
    'import/resolver': {
      'alias': {
        map: [
          [ '@', './' ],
        ],
      },
    },
  },
  globals: {},
  parserOptions: {
    sourceType: 'module',
  },
}
const typescript = {
  files: [ '*.ts', '*.tsx', './vite.config.ts' ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [ './tsconfig.json', './tsconfig.node.json' ],
  },
  extends: [
    ...eslint.extends,
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  plugins: [ ...eslint.plugins, '@typescript-eslint' ],
  settings: {
    ...eslint.settings,
    'import/parsers': {
      '@typescript-eslint/parser': [ '.ts', '.tsx' ],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: `${ __dirname }/tsconfig.json`,
      },
    },
  },
  rules: {
    ...eslint.rules,
    ...readyRules[ 'typescript' ],
    'indent': 'off',
    'func-call-spacing': 'off',
  },
}


module.exports = {
  ...eslint,
  overrides: [
    { ...typescript },
  ],
}
