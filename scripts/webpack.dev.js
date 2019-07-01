const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const util = require('./util')
const base = require('./webpack.base')

module.exports = {
  entry: {
    umd: util.join('src/umd.styl'),
  },
  
  devtool: 'cheap-module-eval-source-map',
  
  mode: 'development',
  
  output: {
    publicPath: '/',
  },
  
  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
  },
  
  module: {
    rules: [
      {
        test: /\.(styl|stylus|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'stylus-loader',
        ],
      },
    ],
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'umd.css',
    }),
    
    new HtmlPlugin({
      template: util.join('example/index.html'),
    }),
  ],
}
