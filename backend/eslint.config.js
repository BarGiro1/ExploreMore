module.exports = {
    env: {
        node: true,
        es2022: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    rules: {
        "no-unused-vars": "warn",
        "no-console": "off"
    }
};
