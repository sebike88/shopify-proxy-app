import Router from 'koa-router';
import dotenv from 'dotenv';
import axios from 'axios';

import {readManifest, manifestStorefrontArray} from '../helpers/utils';

import {GET_SCRIPTTAGS, WRITE_SCRIPTTAGS, DELETE_SCRIPTTAGS} from '../helpers/graphQueries';

dotenv.config();

const { SHOPIFY_PRIVATE_API_SECRET_KEY } = process.env;
const graphQlAddress = 'https://sbk-app-store.myshopify.com/admin/api/2020-07/graphql.json';


const router = new Router();

// graphQlScriptTag(DELETE_SCRIPTTAGS)
//   .catch((error) => {
//     console.log('DELETE_SCRIPTTAGS', error);
//   });

/**
 * Links to 'apps/proxy' route in the app proxy extension settings.
 */
router.get('/storefront', async (ctx) => {
  ctx.type='application/liquid';
  // ctx.status = 200;
  // ctx.body = `console.log('hey')`

  try {
    ctx.status = 200;
    const data = await readManifest();
    const filesArr = await manifestStorefrontArray(data.toString());

    ctx.body = filesArr.join('');
    // ctx.body = `console.log('hey')`
  } catch (error) {
    console.log('/storefront', error);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
});

graphQlScriptTag(GET_SCRIPTTAGS)
  .then((result) => {
    const {edges} = result.data.data.scriptTags;

    if (edges.length === 0) {
      graphQlScriptTag(WRITE_SCRIPTTAGS)
      .catch((error) => {
        console.log('WRITE_SCRIPTTAGS', error);
      });
    }
  }).catch((error) => {
    console.log('GET_SCRIPTTAGS', error);
  });

async function graphQlScriptTag(query) {
  return new Promise((resolve, reject) => {
    axios({
      url: graphQlAddress,
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