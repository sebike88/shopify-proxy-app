import Router from 'koa-router';

const router = new Router();

/**
 * Links to 'apps/proxy' route in the app proxy extension settings.
 */
router.get('/storefront', async (ctx) => {
  ctx.type='application/liquid';
  ctx.status = 200;
  ctx.body = 'console.log("storefront added")';
});

module.exports = router;