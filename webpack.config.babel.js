import path from "path"
import ProgressBarPlugin from "progress-bar-webpack-plugin"

const config = {
  mode: "production",
  devtool: "source-map",
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
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
