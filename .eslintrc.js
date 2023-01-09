module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended'
  ],
  plugins: ['prettier', 'eslint-plugin-vue', '@typescript-eslint', 'eslint-plugin-import'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      tsx: true,
      jsx: true
    }
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.vue'],
    'import/resolver': {
      alias: {
        map: [['@', './src']]
      },
      typescript: {}
    }
  },
  rules: {
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/named': 'error',
    'import/namespace': ['error', { allowComputed: true }],
    'import/default': 'off',
    'import/export': 'error',
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'avoid',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        trailingComma: 'none',
        printWidth: 120,
        singleAttributePerLine: true,
        bracketSameLine: false
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'new-cap': ['error', { capIsNew: true }],
    'no-else-return': [
      'error',
      {
        allowElseIf: false
      }
    ],
    'prefer-template': 'error',
    'no-confusing-arrow': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: true }],
    'arrow-body-style': ['error', 'as-needed'],
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    'max-len': ['warn', { code: 120 }],
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'error',
    'vue/multi-word-component-names': 'off',
    'no-var': 'error',
    'no-undef': 'error', // ts 项目中关闭，使用 volar校验变量异常
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': [
      'error',
      {
        named: 'never',
        asyncArrow: 'ignore'
      }
    ], // 函数后空格
    'vue/no-multiple-template-root': 0,
    'vue/no-v-model-argument': 'off',
    'vue/no-v-html': 0,
    'vue/singleline-html-element-content-newline': 0, // 文本单独一行
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 1
        },
        multiline: {
          max: 1
        }
      }
    ],
    indent: ['warn', 2, { SwitchCase: 1 }]
  }
}
