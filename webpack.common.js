const path = require("path");
module.exports = {
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
  }
}
