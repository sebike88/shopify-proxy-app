import Koa from 'koa'
import Router from 'koa-router'
import React from 'react';
import { renderToString } from 'react-dom/server';

const serve = require('koa-static');

import Layout from './components/Layout';

const app = new Koa();

const router = new Router();

router.get('/proxy', (ctx, next) => {
  const jsx = ( <Layout /> );
  const ReactDom = renderToString( jsx );
  ctx.type='application/liquid';
  ctx.status=200;
  ctx.body= htmlTemplate(ReactDom);

});

router.get('/proxy/static/js/client.js', (ctx, next) => {
  ctx.type='javascript';
  ctx.body = `console.log('hey')`;
});

app.use(router.routes());

function htmlTemplate( reactDom ) {
    return `
      <div class="container shopify-section index-section" id="app">${ reactDom }</div>
      <script src="proxy/static/js/client.js"></script>
    `;
}

module.exports = router;