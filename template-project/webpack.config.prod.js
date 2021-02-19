const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const RobotstxtPlugin = require('robotstxt-webpack-plugin')
const JavaScriptObfuscatorPlugin = require('webpack-obfuscator')

module.exports = {
  entry: './src/app.ts',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, './'),
    }),
    new JavaScriptObfuscatorPlugin(
      {
        disableConsoleOutput: process.env.ENV === 'production',
        debugProtection: process.env.ENV === 'production',
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        selfDefending: true,
        stringArrayEncoding: 'rc4',
        stringArrayThreshold: 1,
        renameGlobals: true,
      },
      ['**/vendors*.js'],
    ),
    new RobotstxtPlugin({
      filePath: './robots.txt',
    }),
  ]
}