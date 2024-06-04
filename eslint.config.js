const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    files: ["*.js", "**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
];
