import Router from 'koa-router'
import React from 'react';
import { renderToString } from 'react-dom/server';

import Layout from './components/Layout';


const router = new Router();

router.get('/proxy', (ctx, next) => {
  const jsx = ( <Layout /> );
  const ReactDom = renderToString( jsx );
  ctx.type='application/liquid';
  ctx.status=200;
  ctx.body= htmlTemplate(ReactDom);
})

function htmlTemplate( reactDom ) {
    return `
      <div class="container shopify-section index-section" id="app">${ reactDom }</div>
      <script src="app.js"></script>
    `;
}

module.exports = router;