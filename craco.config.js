const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const resolvedSrcPath = path.resolve(__dirname, "src");
      webpackConfig.resolve = webpackConfig.resolve ?? {};
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias ?? {}),
        "@": resolvedSrcPath,
      };
      return webpackConfig;
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs",
        "^react-router-dom$":
          "<rootDir>/node_modules/react-router-dom/dist/index.js",
        "^react-router$": "<rootDir>/node_modules/react-router/dist/development/index.js",
        "^react-router/dom$":
          "<rootDir>/node_modules/react-router/dist/development/dom-export.js",
        "^@/(.*)$": "<rootDir>/src/$1",
      },
    },
  },
  style: {
    postcss: {
      mode: "file",
    },
  },
};
