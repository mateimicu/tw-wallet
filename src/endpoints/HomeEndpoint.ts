import { promises as fsAsync } from "fs";
import { Response } from "../utils/HttpUtils";
import Logger from "../utils/Logger";
import { Endpoint } from "./Endpoint";

export class HomeEndpoint extends Endpoint {
  async get(): Promise<Response> {
    Logger.info("Serving home page");

    const fileContent = await fsAsync.readFile("src/views/home.html", {
      encoding: "utf8",
    });

    return {
      statusCode: 200,
      body: fileContent,
    };
  }
}
