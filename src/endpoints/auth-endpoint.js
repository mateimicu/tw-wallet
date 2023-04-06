import crypto from 'crypto';
import { parse } from "querystring";
import { promises as fsAsync } from "fs";


import { Endpoint } from './endpoint.js'
import { SessionRepository, Session } from '../auth/session.js'
import { UserRepository } from '../auth/user.js'
import {
  DbHelper,
} from './../db/db-helper.js';


export class LoginEndpoint extends Endpoint {
  async get(_, resp) {
    resp.writeHead(200);
    resp.end(await fsAsync.readFile('src/views/login.html'))
  }

  async post(req, resp) {
    const dbHelper = new DbHelper();
    const db = await dbHelper.getDbConnection();
    const sessionRepository = new SessionRepository(db);
    const userRepository = new UserRepository(db);

    // Validam ca informatiile primite sunt corecte
    const body = await getBody(req);
    const values = parse(body);

    const username = values.username ?? undefined;
    const password = values.password ?? undefined;

    if (username == undefined || password == undefined) {
      // QUESTION: Ce inseamna 403
      resp.writeHead(403);
      resp.end((await fsAsync.readFile('src/views/login_reusit.html', { encoding: "utf8" })).replace("REPLACE_ME", "Form Invalid"));
      return;
    }

    const user = await userRepository.getUserByAuth(username, password);
    console.log(user);

    if (user == undefined) {
      // QUESTION: Ce inseamna 401
      resp.writeHead(401);
      resp.end((await fsAsync.readFile('src/views/login_reusit.html', { encoding: "utf8" })).replace("REPLACE_ME", "Autentificare Esuata"));
      return;
    }

    // TODO: Putem evita sa facem o sesiune noua pentru fiecare login ?
    const session = new Session(
      crypto.randomUUID(),
      new Date().toISOString(),
      user,
    );

    await sessionRepository.saveSession(session);

    resp.writeHead(200, { "Set-Cookie": `session=${session.id}` });
    resp.end(await fsAsync.readFile('src/views/login_reusit.html'))
  }

}

export class LogoutEndpoint extends Endpoint {

  async get(_, resp) {
    // TODO: Invalidati sesiunea si stergeti acel cookie
    resp.writeHead(200, { 'Set-Cookie': "session=d; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT" });
    resp.end(await fsAsync.readFile('src/views/logout.html'))
  }

}

export class SecretEndpoint extends Endpoint {

  async get(req, resp) {
    const dbHelper = new DbHelper();
    const db = await dbHelper.getDbConnection();
    const sessionRepository = new SessionRepository(db);
    const userRepository = new UserRepository(db);

    const cookies = getCookies(req);
    const sessionId = cookies.session ?? undefined;


    const session = await sessionRepository.getSessionById(sessionId);

    if (sessionId == undefined || session == undefined) {
      resp.writeHead(401);
      resp.end(await fsAsync.readFile('src/views/access_interzis.html')).
        return;
    }

    resp.writeHead(200);
    resp.end(
      (await fsAsync.readFile('src/views/secret.html', { encoding: "utf8" }))
        .replace("REPLACE_ME",
          JSON.stringify(
            {
              sessions: await sessionRepository.getSessions(),
              users: await userRepository.getUsers(),
            }, null, 2).replace(/\n/g, '</br>')
        )
    );
  }

}

const getBody = async (request) => {
  let body = "";

  for await (const chunk of request) {
    body += chunk.toString();
  }

  return body;
};

const cookieSeparator = ";";
const cookieKeyValuesSeparator = "=";

const getCookies = (request) => {
  const cookieStrings = request.headers?.cookie?.split(cookieSeparator) ?? null;

  if (!cookieStrings) return {};

  const cookies = {};
  for (const cookieString of cookieStrings) {
    const [key, ...values] = cookieString.split(cookieKeyValuesSeparator);
    const trimmedKey = key?.trim();

    if (!trimmedKey || !values || values?.length < 1) {
      continue;
    }

    cookies[key] = values.join(cookieKeyValuesSeparator);
  }

  return cookies;
};
