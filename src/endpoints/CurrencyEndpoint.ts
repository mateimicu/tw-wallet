import { WALLETS } from "../data/Data";
import { Request, Response } from "../utils/HttpUtils";
import { Endpoint } from "./Endpoint";
import { ErrorCode } from "./ErrorCode";

export class CurrencyEndpoint extends Endpoint {
  async get(request: Request<WalletParams, any>): Promise<Response> {
    const walletId: string = request?.params?.walletId;
    const wallet = WALLETS[walletId];

    if (!wallet) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error_code: ErrorCode.WALLET_NOT_FOUND,
          error_message: `Can't find wallet with id ${walletId}`,
        }),
      };
    }

    const currency = wallet.currencies.find(
      (c) => c.ticker === request.params?.ticker
    );

    if (!currency) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error_code: ErrorCode.CURRENCY_NOT_FOUND,
          error_message: `Can't find currency with ticker ${request.params?.ticker} in wallet with id ${walletId}`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(currency),
    };
  }

  // async patch(_): Promise<Response>;  TB IMPLEMENTED
  // async delete(_): Promise<Response>;  TB IMPLEMENTED
}

export interface WalletParams {
  walletId: string;
  ticker: string;
}
