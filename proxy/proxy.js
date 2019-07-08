import Router from 'koa-router'


const router = new Router();

router.get('/proxy', (ctx, next) => {
  ctx.type='application/liquid';
  ctx.status=200;
  ctx.body= htmlTemplate('Hello!');
})

function htmlTemplate( reactDom ) {
    return `
      <div class="container shopify-section index-section" id="app">${ reactDom }</div>
      <script src="./app.bundle.js"></script>
    `;
}

module.exports = router;