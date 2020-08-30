require('@babel/polyfill');
require('isomorphic-fetch');
import Koa from 'koa'
import next from 'next';
import serve from 'koa-static-server';
import createShopifyAuth from '@shopify/koa-shopify-auth';
import dotenv from 'dotenv';
import { verifyRequest }from '@shopify/koa-shopify-auth';
import session from 'koa-session';

import proxy from './proxy/proxy';

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;

app.prepare().then(() => {
  const server = new Koa();

  server.use(session(server));
  
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(createShopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET_KEY,
    scopes: ['read_products'],
    afterAuth(ctx) {
      const { shop, accessToken } = ctx.session;
      ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
      ctx.redirect('/');
    }
  }));

  server.use(serve({rootDir: '.next/static/chunks', rootPath: '/proxy/static'}))
  server.use(proxy.routes());
  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.listen(port, () => {
    console.log(`>_> Ready on localhost:${port} <_<`);
  })
});