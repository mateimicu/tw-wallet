import http from 'http';

import { NotFoundEndpoint } from './endpoints/endpoint.js'
import { HomeEndpoint } from './endpoints/home-endpoint.js'
import { StaticEndpoint } from './endpoints/static-endpoint.js'
import {
  LoginEndpoint,
  LogoutEndpoint,
  SecretEndpoint,
} from './endpoints/auth-endpoint.js'

import {
  DbHelper,
  SchemaInitializer,
  SeedInitializer,
} from './db/db-helper.js';

const ENDPOINTS = {
  "^/$": new HomeEndpoint(),
  "^/login$": new LoginEndpoint(),
  "^/logout$": new LogoutEndpoint(),
  "^/secret$": new SecretEndpoint(),
  "^/static/.*": new StaticEndpoint(),
  "": new NotFoundEndpoint(),
}

const router = async (req, resp) => {
  console.log(`[INFO]: Request nou ${req.method}: ${req.url} `);
  for (const [path, endpoint] of Object.entries(ENDPOINTS)) {


    // Compilam obiectul regex
    // QUESTION: Putem imbunatati performanta ?
    const regex = new RegExp(path);

    // Verificam daca calea acestui request se potriveste
    if (regex.test(req.url)) {

      console.log(`[INFO]: Am gasit calea ${req.url} si va fi rutat cate ${path}`);

      // Apelam metoda potrivita pentru acest request
      // QUESTION: Ce se intampla daca avem o eroare ?
      await endpoint[req.method.toLowerCase()](req, resp);
      break;
    }
  }
  console.log(`[WARN]: Nu gasit endpoint pentru calea ${req.url}`);
}


const main = async () => {
  const dbHelper = new DbHelper();
  const db = await dbHelper.getDbConnection();

  const initializer = new SchemaInitializer(db);
  await initializer.initDbSchema();

  const seeder = new SeedInitializer(db);
  await seeder.initDbSeed();



  const server = http.createServer(router);
  server.listen(8089);
}

main();
