
import fs from 'fs';

/**
* Helper functions.
*/
export function readManifest() {
 return new Promise((resolve, reject) => {
   fs.readFile(__dirname + '/../manifest.js', (err, data) => {
     if (err) {
       console.log('readManifest', err);
       reject(err);
       throw err;
     }
     resolve(data);
   });
 });
}

async function getStorefrontScript(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + `/../.next/static/chunks/${file}`, (err, data) => {
      if (err) {
        console.log('getStorefrontScript', err);
        reject(err);
        throw err;
      }
      resolve(data);
    });
  })
}

export async function manifestStorefrontArray(string) {
  const arr = JSON.parse(string);
  const sanitizedArr = arr
    .filter(item => {
      return item.includes('polyfills') ||
        item.includes('storefront') ||
        item.includes('webpack');
    })
    .map(item => item.split('/').pop());

  const scripts = sanitizedArr.map(async (item) => {
    const script = await getStorefrontScript(item);

    return script.toString();
  });

  const renderedScripts = Promise.all(scripts).then((response) => response);

  return await renderedScripts;
}

export function manifestProxyArray(string) {
  const arr = JSON.parse(string);
  const sanitizedArr = arr
    .filter(item => {
      return (
        item.includes('polyfills') ||
        item.includes('proxy') ||
        item.includes('webpack')
      );
    })
    .map(item => item.split('/').pop());

  return sanitizedArr;
}

export async function renderStorefrontScript() {

}