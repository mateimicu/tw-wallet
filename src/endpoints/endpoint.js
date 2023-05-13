export class Endpoint {

  async get(_, resp, args) {
    resp.writeHead(404, {});
    resp.end("Not Found")
  }

  async post(_, resp, args) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async head(_, resp, args) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async del(_, resp, args) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async option(_, resp, args) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }
}

export class NotFoundEndpoint extends Endpoint {
}
