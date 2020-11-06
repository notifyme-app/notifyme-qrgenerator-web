const path = require("path");
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
      path: __dirname + "/dist",
      filename: "bundle.js",
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(woff|woff2|ttf|otf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "static/fonts"
              }
            },
          ]
        }
      ],
    },
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        BASE_URL: JSON.stringify(env.BASE_URL),
        GIT_INFO: JSON.stringify(env.GIT_INFO),
        PUBLIC_KEY: JSON.stringify(env.PUBLIC_KEY),
        UPLOAD_URL: JSON.stringify(env.UPLOAD_URL),
      }),
    ],
  };
}
