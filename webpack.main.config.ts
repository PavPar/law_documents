import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
const { cwd } = require("node:process");
const { resolve } = require("node:path");

const TsconfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json", ".svg"],
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: resolve(cwd(), "./tsconfig.json"),
      }),
    ],
  },
};
