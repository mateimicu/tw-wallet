import { IncomingMessage } from "http";
import { AuthStategy } from "./AuthStategy";

export class Authenticator {
  static auth(authStategy: AuthStategy, request: IncomingMessage): boolean {
    switch (authStategy) {
      case AuthStategy.NONE:
        return true;
      case AuthStategy.DENY:
        return false;
      default:
        return true;
    }
  }
}
