const path = require('path');

module.exports = {
  entry: "./src/app/index.ts",
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.html' ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.mp4$/,
        loader: 'url-limit=10000&mimetype=video/mp4'
      }
    ]
  },
   output: {
    filename: "script.js",
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty'
  }
}
