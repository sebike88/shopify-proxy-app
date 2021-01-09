import Router from 'koa-router';
import dotenv from 'dotenv';
import axios from 'axios';

import {readManifest, manifestStorefrontArray} from '../helpers/utils';
import {GET_SCRIPTTAGS, WRITE_SCRIPTTAGS, DELETE_SCRIPTTAGS} from '../helpers/graphQueries';

dotenv.config();

const { SHOPIFY_PRIVATE_API_SECRET_KEY } = process.env;
function graphQlAddress(address) {
  return `https://${address}/admin/api/2020-07/graphql.json`
}
const router = new Router();

/**
 * Links to 'apps/proxy' route in the app proxy extension settings.
 */
router.get('/storefront', async (ctx) => {
  ctx.type='application/liquid';
  const address = ctx.request.url.split('=')[1];
  const {referer} = ctx.request.header;

  try {
    ctx.status = 200;
    const data = await readManifest();
    const filesArr = await manifestStorefrontArray(data.toString(), referer);

    await graphQlScriptTag(GET_SCRIPTTAGS, address)
      .then((result) => {
        const {edges} = result.data.data.scriptTags;

        if (edges.length === 0) {
          graphQlScriptTag(WRITE_SCRIPTTAGS, address)
          .catch((error) => {
            console.log('WRITE_SCRIPTTAGS', error);
          });
        }
      }).catch((error) => {
        console.log('GET_SCRIPTTAGS', error);
      });

    ctx.body = filesArr.join('');
  } catch (error) {
    console.log('/storefront', error);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
});

  // graphQlScriptTag(DELETE_SCRIPTTAGS)
  //   .catch((error) => {
  //     console.log('DELETE_SCRIPTTAGS', error);
  //   });

async function graphQlScriptTag(query, address) {
  return new Promise((resolve, reject) => {
    axios({
      url: graphQlAddress(address),
      method: 'post',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_PRIVATE_API_SECRET_KEY,
      },
      data: {
        query: query,
      },
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error.response);
      reject(error.response);
    });
  })
}

module.exports = router;