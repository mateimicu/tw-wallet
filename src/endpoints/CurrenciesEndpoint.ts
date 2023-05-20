import { TICKERS, WALLETS } from "../data/Data";
import { Request, Response } from "../utils/HttpUtils";
import { Endpoint } from "./Endpoint";
import { ErrorCode } from "./ErrorCode";

export class CurrenciesEndpoint extends Endpoint {
  async get(request: Request<CurrenciesParams, any>): Promise<Response> {
    const wallet = WALLETS[request?.params?.walletId];

    if (!wallet) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error_code: ErrorCode.WALLET_NOT_FOUND,
          error_message: `Can't find wallet with id ${request?.params?.walletId}`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        currencies: wallet.currencies.map((currency) => currency.ticker),
      }),
    };
  }

  async post(request: Request<CurrenciesParams, Currency>): Promise<Response> {
    const wallet = WALLETS[request?.params?.walletId];

    if (!wallet) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error_code: ErrorCode.WALLET_NOT_FOUND,
          error_message: `Can't find wallet with id ${request?.params?.walletId}`,
        }),
      };
    }
    const currency = request?.body;

    if (!currency || !currency.ticker) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error_code: ErrorCode.CURRENCY_MALFORMED,
          error_message: `Currency has a malformed body.${
            currency ? "" : "Ticker is missing."
          }`,
        }),
      };
    }

    if (wallet.currencies.find((c) => c.ticker === currency.ticker)) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error_code: ErrorCode.CURRENCY_ALREADY_EXISTS,
          error_message: `Currency with ticker ${currency.ticker} already exists in wallet with id ${request?.params?.walletId}`,
        }),
      };
    }

    if (!TICKERS.includes(currency.ticker)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error_code: ErrorCode.CURRENCY_NOT_SUPPORTED,
          error_message: `Currency with ticker ${currency.ticker} is not supported`,
        }),
      };
    }

    if (!Number.isFinite(currency.value)) {
      currency.value = 0;
    }

    if (WALLETS[request?.params?.walletId].currencies) {
      WALLETS[request?.params?.walletId].currencies.push(currency);
    } else {
      WALLETS[request?.params?.walletId].currencies = [currency];
    }

    return {
      statusCode: 200,
      body: JSON.stringify(currency),
    };
  }
}

export interface CurrenciesParams {
  walletId: string;
}

export interface Currency {
  ticker: string;
  value: number;
}
