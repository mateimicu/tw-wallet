import { promises as fsAsync } from "fs";

import { Endpoint } from './endpoint.js'


export class HomeEndpoint extends Endpoint {

  async get(_, resp) {
    resp.writeHead(200);
    resp.end(await fsAsync.readFile('src/views/homepage.html', { encoding: "utf8" }))
  }

}
