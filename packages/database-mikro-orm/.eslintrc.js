module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    "jest/globals": true
  },
  plugins: ["@typescript-eslint", "prettier", "jest"],

  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json"
  },
  extends: [
    // from @nuxtjs example
    "standard",
    "plugin:import/errors",
    "plugin:import/warnings",
    // from ts-eslint example
    // "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    // "prettier/standard",
    "prettier/@typescript-eslint"
  ],
  // add your custom rules here
  rules: {
    semi: "off",
    "@typescript-eslint/semi": ["warn"],
    quotes: ["error", "double"],

    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],

    "no-unused-vars": [
      "off",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: true
      }
    ],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_W*" }],

    "@typescript-eslint/no-parameter-properties": ["error", { allows: ["private readonly"] }],
    "no-useless-constructor": "off",
    "no-return-assign": "off",
    // for parity with client
    // Get this by running `eslint --print-config <filename> > config.js` and diffing them
    // ts-eslint

    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/ban-types": "error",
    camelcase: [
      "error",
      {
        properties: "never",
        ignoreDestructuring: false
      }
    ],
    "@typescript-eslint/camelcase": "error",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "no-public"
      }
    ],
    indent: [
      "off",
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1
        },
        FunctionExpression: {
          parameters: 1,
          body: 1
        },
        CallExpression: {
          arguments: 1
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false
      }
    ],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/interface-name-prefix": "error",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-angle-bracket-type-assertion": "error",
    "no-array-constructor": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-object-literal-type-assertion": "error",
    // "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-triple-slash-reference": "error",
    "no-use-before-define": [
      "error",
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-interface": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/type-annotation-spacing": "off",
    // Others

    "no-use-before-define": ["error"],
    "space-before-function-paren": [
      "off",
      {
        anonymous: "always",
        named: "never"
      }
    ],

    "import/first": 2,
    "import/no-unresolved": 0,
    "import/order": 2,
    "import/no-mutable-exports": 2,
    "arrow-parens": [
      "off",
      "as-needed",
      {
        requireForBlockBody: true
      }
    ],
    "prefer-const": [
      2,
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false
      }
    ],
    "no-lonely-if": 2,
    "require-await": 1,
    "dot-notation": 2,
    "no-var": 2,
    "no-console": 2
  }
};
