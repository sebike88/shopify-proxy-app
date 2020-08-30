const path = require('path')
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
 const nextCSS = withCSS({
  webpack: (config) => {
    console.log(config.entry)
    const env = { API_KEY: apiKey };

    console.log(config);

    config.plugins.push(new webpack.DefinePlugin(env));

    return Object.assign({}, config, { entry: function() {
      return config.entry().then((entry) => {
        return Object.assign({}, entry, { 'proxy': './proxy/public/client.js'})
      });
    }});

    return config;
  },
});

module.exports = nextCSS;
