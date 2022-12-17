const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ type }) => {
  return {
    mode: type ? 'production' : 'development',
    devtool: type ? 'hidden-nosources-source-map' : 'source-map',
    context: path.resolve(__dirname, './src'),
    resolve: {
      extensions: ['.js', '.json', '.ts'],
    },
    entry: {
      main: './index.ts',
    },
    output: {
      path: type
        ? path.resolve(__dirname, './dist')
        : path.resolve(__dirname, './dev'),
      filename: type
        ? '[contenthash].bundle.js'
        : '[name].[contenthash].bundle.js',
      assetModuleFilename: type
        ? '[path][contenthash][ext]'
        : '[path][name].[contenthash][ext]',
      clean: {
        keep: /\.git/,
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      port: 8080,
      hot: true,
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Index',
        filename: 'index.html',
        chunks: ['main'],
        template: path.resolve(__dirname, './src/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
      }),
      new ESLintPlugin({ extensions: ['ts', 'js'] }),
    ],
    module: {
      rules: [
        {
          test: /\.(ttf|woff|woff2|eot)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg|ico)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(mp4|webm|ogv|ogg)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(mp3|wav)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            type ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'ts-loader'],
        },
      ],
    },
  };
};
