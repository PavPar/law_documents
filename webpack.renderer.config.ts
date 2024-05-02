import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
const { cwd } = require("node:process");
const { resolve } = require("node:path");

const TsconfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});
rules.push({
  test: /\.(gif|svg|jpg|png)$/,
  use: ["file-loader"],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".svg"],
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: resolve(cwd(), "./tsconfig.json"),
      }),
    ],
  },
};
