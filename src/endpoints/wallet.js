import { v4 as uuidv4 } from 'uuid';


import { Endpoint } from './endpoint.js'

// Error codes
const WALLET_NOT_FOUND = "E001";
const CURRENCY_NOT_FOUND = "E002";
const CURRENCY_ALREADY_EXISTS = "E003";
const CURRENCY_MALFORMED = "E004";
// NOTE(mmicu): not used for now.
//const CURRENCY_NOT_NOT_SUPPORTED = "E003";

let WALLET_DATA = {
  "4a8155df-abad-43e8-a4fd-1f5fa0c7384f": {
    "descriere": "...",
    "currency": {
      "RON": { value: 10},
      "GBP": { value: 5},
    }

  },
  "d9f081da-45bb-43d1-abaa-2bb2c5ff182f": {
    "descriere": "...",
    "currency": {
      "RON": { value: 1},
      "GBP": { value: 2},
      "EUR": { value: 3},
    }
  }
}


export class Wallet extends Endpoint {
  async get(_, resp, args) {
    // extragere paths ?
    // /wallet/11111/
    let id = args.wallet_id
    let wallet = WALLET_DATA[id];
    if (wallet) {
      let response = {
        "id": id,
        "descriere": wallet["descriere"],
        "currency": Object.keys(wallet["currency"]),
      }
      resp.writeHead(200);
      resp.end(JSON.stringify(response));
    } else {
      resp.writeHead(404);
      resp.end(JSON.stringify({"error_code": 404, "error_message": `Can't find wallet with id ${id}`}));
    }
  }
  async del(_, __, __) {
    console.log(" DE IMPLEMENTA ");
  }
  async patch(_, __, __) {
    console.log(" DE IMPLEMENTA ");
  }
}

export class WalletIndex extends Endpoint {

  async get(_, resp, __) {
    resp.writeHead(200);
    let response = { "wallets": Object.keys(WALLET_DATA) }
    resp.end(JSON.stringify(response));
  }

  async post(req, resp) {
    let body = await getBody(req);
    let id = uuidv4();
    console.log(JSON.stringify(body), id);
    WALLET_DATA[id] = {
      "descriere":  body["descriere"] || "",
      "currency": {}
    }
    resp.writeHead(200);
    resp.end(JSON.stringify({"wallet_id": id}));
  }
}

export class Currency extends Endpoint {
  async get(_, resp, args) {
    let id_wallet = args.wallet_id
    let id_currency = args.currency_id
    let wallet = WALLET_DATA[id_wallet];

    if (wallet == undefined){
      resp.writeHead(404);
      resp.end(JSON.stringify({"error_code": WALLET_NOT_FOUND, "error_message": `Can't find walletg with id ${id_wallet}`}));
      return;
    }

    let currency = wallet["currency"][id_currency];
    if (currency == undefined){
      resp.writeHead(404);
      resp.end(JSON.stringify({"error_code": CURRENCY_NOT_FOUND, "error_message": `Can't find currency with id ${id_currency} in wallet ${id_wallet}`}));
      return;
    }
    resp.writeHead(200);
    resp.end(JSON.stringify({"value": currency}));
  }

  async post(req, resp, args) {
    let body = await getBody(req);
    let id_wallet = args.wallet_id;
    let id_currency = args.currency_id;
    let wallet = WALLET_DATA[id_wallet];

    if (wallet == undefined){
      resp.writeHead(404);
      resp.end(JSON.stringify({"error_code": WALLET_NOT_FOUND, "error_message": `Can't find walletg with id ${id_wallet}`}));
      return;
    }

    if (wallet[id_currency] != undefined){
      resp.writeHead(422); // Maybe also 409
      resp.end(JSON.stringify(
        {
          "error_code": CURRENCY_ALREADY_EXISTS,
          "error_message": `Currency ${id_currency} already in walled withid ${id_wallet}`}));
      return;
    }

    try {
      let parsedBody = {value: 0}
      if (body && body !== "") {
        parsedBody = JSON.parse(body)
      }
      WALLET_DATA[id_wallet]["currency"][id_currency] = parsedBody;
    } catch(e) {
      console.log(`[ERROR]: ${e}`);
      resp.writeHead(400);
      resp.end(JSON.stringify(
        {
          "error_code": CURRENCY_MALFORMED,
          "error_message": `Currency ${id_currency} in ${id_wallet} had a malformed body`}));
      return;

    }
    resp.writeHead(200);
    resp.end(JSON.stringify(WALLET_DATA[id_wallet][id_currency]));
  }
  async del(_, __, ___) {
    console.log("De Implementa");
  }
  async path(_, __, ___) {
    console.log("De Implementa");
  }
  async put(_, __, ___) {
    console.log("De Implementa");
  }
}

const getBody = async (request) => {
  let body = "";

  for await (const chunk of request) {
    body += chunk.toString();
  }

  return body;
};
