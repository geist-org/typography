const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizePlugin = require('optimize-css-assets-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const util = require('./util')

class Without {
  constructor(patterns) {
    this.patterns = patterns
  }
  
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MiniCssExtractPluginCleanup', (compilation, callback) => {
      Object.keys(compilation.assets)
        .filter(asset => {
          let match = false,
            i = this.patterns.length
          
          while (i--) {
            if (this.patterns[i].test(asset)) {
              match = true
            }
          }
          return match
        })
        .forEach(asset => {
          delete compilation.assets[asset]
        })
      
      callback()
    })
  }
}


module.exports = {
  entry: util.join('src/umd.styl'),
  
  mode: 'production',
  
  output: {
    path: util.join('dist'),
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
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  
    new OptimizePlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        safe: true,
        autoprefixer: true,
      },
    }),
  
    new Without([/main\.js(\.map)?$/]),
    
    new HtmlPlugin({
      template: util.join('example/index.html'),
      excludeChunks: ['main'],
      favicon: util.join('example/favicon.ico'),
      minify: {
        minifyJS: true,
        minifyCSS: true,
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        removeComments: true,
      },
    }),
    
    new HTMLInlineCSSWebpackPlugin(),
  ],
}
