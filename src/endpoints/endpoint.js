export class Endpoint {

  async get(_, resp) {
    resp.writeHead(404, {});
    resp.end("Not Found")
  }

  async post(_, resp) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async head(_, resp) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async del(_, resp) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }

  async option(_, resp) {
    resp.end("Not Found")
    resp.end(404, "Not Found")
  }
}

export class NotFoundEndpoint extends Endpoint {
}
