const path = require('path')
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const ChunkListWebpackPlugin = require('chunk-list-webpack-plugin');

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
 const nextCSS = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };

    config.plugins.push(new webpack.DefinePlugin(env));
    config.plugins.push(new ChunkListWebpackPlugin({output: '../proxy/manifest.js'}));

    return Object.assign({}, config, { entry: function() {
      return config.entry().then((entry) => {
        return Object.assign({}, entry, { 'proxy': './proxy/public/client.js'})
      });
    }});
  },
});

module.exports = nextCSS;
