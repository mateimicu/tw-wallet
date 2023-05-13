import http from 'http';

import { NotFoundEndpoint } from './endpoints/endpoint.js'
import { HomeEndpoint } from './endpoints/home-endpoint.js'
import {
  Wallet,
  WalletIndex,
  Currency,
} from './endpoints/wallet.js'

const ENDPOINTS = {
  "^/?$": new HomeEndpoint(),
  // /wallet/
  "^/wallet/?$": new WalletIndex(),
  // /wallet/<wallet_id>/
  "^/wallet/(?<wallet_id>[0-9a-zA-Z\-]+)/?$": new Wallet(),
  // /wallet/<wallet_id>/<currency>/
  "^/wallet/(?<wallet_id>[0-9a-zA-Z\-]+)/(?<currency_id>[0-9a-zA-Z\-]+)/?$": new Currency(),
  // * Add open api spec route -> to serve the YAML
  // * OPEN API UI served from a route.  You can use a library
  "": new NotFoundEndpoint(),
}

const router = async (req, resp) => {
  console.log(`[INFO]: Request nou ${req.method}: ${req.url} `);
  for (const [path, endpoint] of Object.entries(ENDPOINTS)) {

    const matchAll = req.url.matchAll(path);
    console.log(matchAll);
    const [match] = matchAll;
    if (match) {
      console.log(`[INFO]: Am gasit calea ${req.url} si va fi rutat cate ${path}`);

      await endpoint[req.method.toLowerCase()](req, resp, match.groups ?? {});
      return;
    } else {
      console.log(`[DEBUG] Request ${req.url} nu face match cu ${path}`)
    }
  }
  console.log(`[WARN]: Nu gasit endpoint pentru calea ${req.url}`);

}

const main = async () => {
  const server = http.createServer(router);
  console.log("Open at 127.0.0.1:8089");
  server.listen(8089);
}

main();
