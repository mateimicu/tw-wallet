import { promises as fsAsync } from "fs";
import { join } from 'path';

import { Endpoint } from './endpoint.js'


export class StaticEndpoint extends Endpoint {

  async get(req, resp, _) {
    const staticFilePath = join('src/', req.url);

    console.log(`[INFO]: Serving static file ${req.url} using ${staticFilePath}`);
    resp.writeHead(200);
    resp.end(await fsAsync.readFile(staticFilePath, { encoding: "utf8" }))
  }

}
