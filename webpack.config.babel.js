import path from "path"
import ProgressBarPlugin from "progress-bar-webpack-plugin"

const config = {
  mode: "production",
  devtool: "source-map",
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@shopwp/utils": "@shopwp/utils",
    "@shopwp/api": "@shopwp/api",
    "@shopwp/components": "@shopwp/components",
    "@shopwp/blocks": "@shopwp/blocks",
  },
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
      "@shopwp/utils":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-utils",
      "@shopwp/api":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-api",
      "@shopwp/components":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-components",
      "@shopwp/hooks":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-hooks",
      "@shopwp/blocks":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-blocks",
      "shopwp-common":
        "/Users/andrew/_www/shopwp/htdocs/wp-content/plugins/shopwp-pro/npm-packages/shopwp-components/common",
    },
  },
  plugins: [new ProgressBarPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules)/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrcRoots: ["."],
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
    ],
  },
}

export default config
