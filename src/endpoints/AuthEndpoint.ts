import { Request, Response } from "../utils/HttpUtils";
import { Endpoint } from "./Endpoint";
import { ErrorCode } from "./ErrorCode";
import { readFileSync } from 'fs'
import * as jwt from 'jsonwebtoken'

export class AuthEndpoint extends Endpoint {
  async post(request: Request<any, AuthParams>): Promise<Response> {
    // TODO(mmicu):
    // - username
    // - password
    // - JWT token semnat
    //    - user_id
    //    - drepturi
    //
    // TODO(): ar trebui sa verificam user si parola din DB;
    // Extra point: parola ar trebui sa fie un hasg
    if (!(request.body?.username == "admin" && request.body?.password == "admin")) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: ErrorCode.AUTHENTICATION_FAILED,
        message:"Authentication failed"}),
      };
    }
    // * env variable
    // * config file
    //  - private key
    //  - port
    // * CLI option
    const privateKey = readFileSync('jwtRSA256-private.pem');
    const token = jwt.sign({ sub: 1312312, scope: "admin" }, privateKey, { algorithm: 'RS256' });

    return {
      statusCode: 200,
      body: JSON.stringify(token),
    };
  }
}

export class AuthParams {
  username: string;
  password: string;
}
