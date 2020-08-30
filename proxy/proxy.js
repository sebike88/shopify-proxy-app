import Router from 'koa-router';
import Koa from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Layout from './components/Layout';

import fs from 'fs';
import path from 'path';

const router = new Router();

router.get('/proxy', (ctx, next) => {
  const jsx = ( <Layout /> );
  const ReactDom = renderToString( jsx );
  ctx.type='application/liquid';
  ctx.status=200;
  ctx.body = htmlTemplate(ReactDom);
});

function htmlTemplate( reactDom ) {
    return `
      <div class="container shopify-section index-section" id="app">${ reactDom }</div>
      <script src="proxy/static/polyfills.js"></script>
      <script src="proxy/static/proxy.js"></script>
      <script src="proxy/static/webpack.js"></script>
    `;
}

function readFile() {
  fs.readFile(path.resolve(__dirname, 'dist', 'main.js'), (err, data) => {

    if (err) throw new Error(err);
    console.log('added');
    main = data;
    
  });
}

module.exports = router;