import { IncomingMessage, RequestListener, Server, ServerResponse } from "http";
import { AuthStategy } from "./auth/AuthStategy";
import { Authenticator } from "./auth/Authenticator";
import config from "./config/config.defaults";
import { CurrenciesEndpoint } from "./endpoints/CurrenciesEndpoint";
import { CurrencyEndpoint } from "./endpoints/CurrencyEndpoint";
import { Endpoint } from "./endpoints/Endpoint";
import { ErrorCode } from "./endpoints/ErrorCode";
import { HomeEndpoint } from "./endpoints/HomeEndpoint";
import { NotFoundEndpoint } from "./endpoints/NotFoundEndpoint";
import { WalletEndpoint } from "./endpoints/WalletEndpoint";
import { WalletsEndpoint } from "./endpoints/WalletsEndpoint";
import { Request, RequestBodyHelper, Response } from "./utils/HttpUtils";
import Logger from "./utils/Logger";

const endpoints: Endpoint[] = [
  new HomeEndpoint("^/?$"),
  new WalletsEndpoint("^/api/wallets/?$"),
  new WalletEndpoint("^/api/wallets/(?<walletId>[0-9a-zA-Z-]+)/?$"),
  new CurrenciesEndpoint(
    "^/api/wallets/(?<walletId>[0-9a-zA-Z-]+)/currencies/?$"
  ),
  new CurrencyEndpoint(
    "^/api/wallets/(?<walletId>[0-9a-zA-Z-]+)/currencies/(?<ticker>[0-9a-zA-Z-]+)/?$",
    AuthStategy.DENY
  ),
  new NotFoundEndpoint(".*"),
];

const safeRequestListener: RequestListener = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  try {
    requestListener(request, response);
  } catch (error) {
    Logger.error(
      `Error while processing request: ${request.url}: ${request.method} - ${error}`
    );

    response.writeHead(500);
    response.end("Internal server error");
  }
};

const requestListener: RequestListener = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  Logger.info(`New request ${request.method}: ${request.url}`);

  for (const endpoint of endpoints) {
    const [match] = request.url.matchAll(endpoint.matchingExpression as any);

    if (!match) {
      Logger.debug(
        `No match for ${request.url} on the path ${endpoint.matchingExpression}`
      );
      continue;
    }

    if (!Authenticator.auth(endpoint.authStategy, request)) {
      Logger.debug(
        `Authentication failed for ${request.url} on the path ${endpoint.matchingExpression}`
      );
      response.writeHead(401);
      response.end(
        JSON.stringify({
          error_code: ErrorCode.AUTHENTICATION_FAILED,
          error_message: "Authentication failed",
        })
      );

      return;
    }

    let body: any;

    try {
      body = await RequestBodyHelper.getJsonBody(request);
    } catch (error) {
      Logger.error(`Error while parsing request body: ${error}`);

      response.writeHead(400);
      response.end(
        JSON.stringify({
          error_code: ErrorCode.PAYLOAD_MALFORMED,
          error_message: "JSON payload can not be parsed",
        })
      );

      return;
    }

    const controllerRequest: Request<any, any> = {
      params: match?.groups ?? {},
      body: body,
      url: request.url,
    };
    Logger.debug(`Request body: ${JSON.stringify(controllerRequest)}`);
    const controllerResponse: Response = await endpoint[
      request.method.toLowerCase()
    ](controllerRequest);

    Logger.debug(`Response body: ${JSON.stringify(controllerResponse)}`);

    response.writeHead(controllerResponse.statusCode);
    response.end(controllerResponse.body);

    return;
  }

  Logger.debug(`No match for ${request.url}`);

  response.writeHead(404);
  response.end("Path not found");
};

const main = () => {
  const server = new Server(safeRequestListener);

  Logger.info(`Starting server at http://127.0.0.1:${config.port}`);
  server.listen(config.port);
};

main();
