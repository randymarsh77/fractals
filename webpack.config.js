var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    filename: 'index.html',
    inject: 'body'
});

var config = {
  entry: APP_DIR + '/index.jsx',
	resolve: {
		extensions: [ '', '.html', '.js', '.jsx', '.less' ]
	},
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      },
      {
        test: /\.less$/,
				include : APP_DIR,
        loader: "style!css!autoprefixer!less"
      }
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
};

module.exports = config;
