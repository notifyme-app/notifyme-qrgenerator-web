const path = require("path");
const webpack = require('webpack'); 

module.exports = env => {
  return {
    entry: ['babel-polyfill', "./src/index.js"],
    output: {
      path: __dirname + '/dist',
      filename: "bundle.js"
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            "loader": "babel-loader",
            "options": {
              "presets": [
                "@babel/preset-env",
              ]
            }
          }
        },
      ]
    },
    resolve: {
      fallback: {
        path: require.resolve("path-browserify")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'BASE_URL': JSON.stringify(env.BASE_URL)
      })
    ]
  }
}
