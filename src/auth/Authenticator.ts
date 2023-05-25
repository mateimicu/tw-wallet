import { IncomingMessage } from "http";
import { AuthStategy } from "./AuthStategy";
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import Logger from '../utils/Logger'

export class Authenticator {
  static auth(authStategy: AuthStategy, request: IncomingMessage): boolean {
    switch (authStategy) {
      case AuthStategy.NONE:
        return true;
      case AuthStategy.DENY:
        return false;
      case AuthStategy.JWT:
        // TODO(mmicu): verifica daca un token este valid
        let token: any = request.headers["x-auth"];
        Logger.debug(JSON.stringify(request.headers));
        // De unde luam asta din config
        const cert: jwt.Secret = readFileSync('jwtRSA256-public.pem');
        try {
          // TODO(): ar trebui sa verificam ce exista in token
          Logger.debug(`JWT ${token}  ${cert}`);
          jwt.verify(token, cert)
        } catch (err) {
          Logger.error(err);
          return false;
        }
      default:
        return true;
    }
  }
}
