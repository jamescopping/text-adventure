const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');


module.exports = {
  entry: {
    app: "./src/index.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Text-Adventure",
    }),
    new HtmlWebpackPartialsPlugin({
      path: './src/partials/analytics.html',
      location: 'head',
      priority: 'high'
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "docs"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.xml$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
