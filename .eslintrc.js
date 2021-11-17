module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    rules: {
      'prettier/prettier': 'error',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
      'import/prefer-default-export': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
    },
  },

  overrides: [
    Object.assign(
      {
        files: ['**/*.test.js'],
        env: { jest: true },
        plugins: ['jest'],
      },
      require('eslint-plugin-jest').configs.recommended
    ),
  ],
};
