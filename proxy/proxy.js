import Router from 'koa-router';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Layout from './components/Layout';
import fs from 'fs';
import path from 'path';

const router = new Router();
const jsx = ( <Layout /> );
const ReactDom = renderToString( jsx );


router.get('/proxy', async (ctx) => {
  ctx.type='application/liquid';
  const start = new Date();
  const hrstart = process.hrtime();

  try {
    ctx.status = 200;
    const data = await readManifest();
    const filesArr = await manifestArray(data.toString());
    const end = new Date() - start;
  const hrend = process.hrtime(hrstart)

  console.log('Execution time: %dms', end);
  console.log('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    ctx.body = await htmlTemplate(ReactDom, filesArr);
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
});

/**
 * Helper functions.
 */
function readManifest() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/manifest.js', (err, data) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(data)
    });
  });
}

function manifestArray(string) {
  const arr = JSON.parse(string);
  const sanitizedArr = arr
    .filter(item => {
      return (
        item.includes('polyfills') ||
        item.includes('proxy') ||
        item.includes('webpack')
      )
    })
    .map(item => item.split('/').pop());
  return sanitizedArr;
}

function htmlTemplate(reactDom, scripts) {
    return `
      <div class="container shopify-section index-section" id="app">${ reactDom }</div>
      ${scripts.map(file => `<script src="proxy/static/${file}"></script>`).join('')}
    `;
}

/**
 * Liquid objects are accessible in proxy route.
 */
function productList() {
  return `
    <script type="application/json">
    [
      {% for product in collections.all.products %}
        "{{ product.title }}",
      {% endfor %}
    ]
    </script>
  `;
}

module.exports = router;