import Router from 'koa-router';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { SHOPIFY_PRIVATE_API_SECRET_KEY } = process.env;
const graphQlAddress = 'https://sbk-app-store.myshopify.com/admin/api/2020-07/graphql.json'

const GET_SCRIPTTAGS = `
query {
  scriptTags(first:10) {
    edges {
      node {
        id
        src
      }
    }
  }
}`;

const WRITE_SCRIPTTAGS = `
mutation {
  scriptTagCreate (input: {
      displayScope: ONLINE_STORE,
      src: "https://seb.ngrok.io/storefront"
    }) {
    scriptTag {
      id
    }
    userErrors {
      field
      message
    }
  }
}`;

const DELETE_SCRIPTTAGS = `
mutation {
  scriptTagDelete(id: "gid://shopify/ScriptTag/116815298625") {
    deletedScriptTagId
    userErrors {
      field
      message
    }
  }
}`;

const router = new Router();

// addScriptTag();
// deleteScriptTags();
getScriptTags();

/**
 * Links to 'apps/proxy' route in the app proxy extension settings.
 */
router.get('/storefront', async (ctx) => {
  ctx.type='application/liquid';
  ctx.status = 200;
  ctx.body = 'console.log("storefront added")';
});

function deleteScriptTags() {
  axios({
    url: graphQlAddress,
    method: 'post',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_PRIVATE_API_SECRET_KEY,
    },
    data: {
      query: DELETE_SCRIPTTAGS,
    },
  }).then(result => {
    console.log(result.data);
  }).catch(error => {
    console.log(error.response)
  });
}

function getScriptTags() {
  axios({
    url: graphQlAddress,
    method: 'post',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_PRIVATE_API_SECRET_KEY,
    },
    data: {
      query: GET_SCRIPTTAGS,
    },
  }).then(result => {
    console.log(result.data.data.scriptTags.edges);
    const {edges} = result.data.data.scriptTags;
    if (edges.length === 0) {
      addScriptTag();
    } 
  }).catch(error => {
    console.log(error.response)
  });
}

function addScriptTag() {
  axios({
    url: graphQlAddress,
    method: 'post',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_PRIVATE_API_SECRET_KEY,
    },
    data: {
      query: WRITE_SCRIPTTAGS,
    },
  }).then(result => {
    console.log(result.data);
  }).catch(error => {
    console.log(error.response)
  });
}

module.exports = router;