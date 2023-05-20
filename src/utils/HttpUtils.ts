import { IncomingMessage } from "http";

export class Request<T1, T2> {
  constructor(public params: T1, public body: T2, public url: string) {}
}

export class Response {
  constructor(public statusCode: number, public body: any) {}
}

export class RequestBodyHelper {
  static async getBody(request: IncomingMessage): Promise<string> {
    let body = "";

    for await (const chunk of request) {
      body += chunk.toString();
    }

    return body;
  }

  static async getJsonBody(request: IncomingMessage): Promise<any> {
    const body = await this.getBody(request);

    if (!body || body.length === 0) {
      return null;
    }

    return JSON.parse(body);
  }
}
