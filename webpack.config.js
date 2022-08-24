const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".css"],
  },
  output: {
    filename: "script.user.pre.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
  },
};
