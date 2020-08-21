const path = require('path')
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production'


const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };

    config.plugins.push(new webpack.DefinePlugin(env));
    
    config.optimization.splitChunks = {
      chunks: 'async',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        proxy: {
          test: /[\\/]public[\\/]/,
          name: 'vendors.min',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    }
    return config;
  },
});