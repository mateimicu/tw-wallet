import { promises as fsAsync } from "fs";
import { join } from "path";
import { Request, Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";

export class StaticEndpoint extends Endpoint {
  async get(request: Request<any, any>): Promise<Response> {
    const staticFilePath = join("src/", request.url);

    Logger.info(`Serving static file ${request.url} using ${staticFilePath}`);

    const fileContent = await fsAsync.readFile(staticFilePath, {
      encoding: "utf8",
    });

    return {
      statusCode: 200,
      body: fileContent,
    };
  }
}
