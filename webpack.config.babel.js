import path from "path"
import ProgressBarPlugin from "progress-bar-webpack-plugin"
import webpack from "webpack"

const config = {
  mode: "production",
  devtool: "source-map",
  entry: "./index",
  output: {
    filename: "shopwp-hooks.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "shopwpHooks",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      react: path.resolve("./node_modules/react"),
      "lodash-es": "lodash",
      shopwp: path.resolve("./shopwp-defaults.js"),
    },
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.ProvidePlugin({
      "wp.i18n": "@wordpress/i18n",
      "wp.hooks": "@wordpress/hooks",
      "wp.element": "@wordpress/element",
      shopwp: "shopwp",
      React: "@wordpress/element",
      ReactDOM: "@wordpress/element",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: [
          /(node_modules)/,
          path.resolve("./__tests__"),
          path.resolve("./__mocks__"),
          path.resolve("./test-utils"),
          path.resolve("./tests"),
          path.resolve("./dist"),
        ],
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrcRoots: ["."],
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        ],
      },
    ],
  },
}

export default config
