require('babel-register')({
  presets: ['react', 'env'],
  plugins: ['transform-class-properties']
});
require('./server');