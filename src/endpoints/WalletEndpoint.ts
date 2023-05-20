import { WALLETS } from "../data/Data";
import { Request, Response } from "../utils/HttpUtils";
import { Endpoint } from "./Endpoint";
import { ErrorCode } from "./ErrorCode";

export class WalletEndpoint extends Endpoint {
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: walletId,
        description: wallet.description,
        currencies: wallet.currencies.map(
          (currency: { ticker: string }) => currency.ticker
        ),
      }),
    };
  }

  // async patch(_): Promise<Response>;  TB IMPLEMENTED
  // async delete(_): Promise<Response>;  TB IMPLEMENTED
}

export interface WalletParams {
  walletId: string;
}
