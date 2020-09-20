export const GET_SCRIPTTAGS = `
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

export const WRITE_SCRIPTTAGS = `
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

export const DELETE_SCRIPTTAGS = `
mutation {
  scriptTagDelete(id: "gid://shopify/ScriptTag/116815298625") {
    deletedScriptTagId
    userErrors {
      field
      message
    }
  }
}`;