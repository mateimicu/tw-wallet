import { WALLETS } from "../data/Data";
import { Request, Response } from "../utils/HttpUtils";
import IdGenerator from "../utils/IdGenerator";
import { Endpoint } from "./Endpoint";
import { ErrorCode } from "./ErrorCode";

export class WalletsEndpoint extends Endpoint {
  async get(): Promise<Response> {
    return {
      statusCode: 200,
      body: JSON.stringify({
        wallets: Object.keys(WALLETS),
      }),
    };
  }

  async post(request: Request<any, Wallet>): Promise<Response> {
    if (!request?.body?.description || request.body.description.length > 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error_code: ErrorCode.WALLET_MALFORMED,
          error_message: "Wallet has a malformed body",
        }),
      };
    }

    if (!request?.body?.currencies) {
      request.body.currencies = [];
    }

    const walletId = IdGenerator.randomId();

    WALLETS[walletId] = request.body;

    return {
      statusCode: 200,
      body: JSON.stringify({ walletId }),
    };
  }
}

export interface Wallet {
  description: string;
  currencies: string[];
}
