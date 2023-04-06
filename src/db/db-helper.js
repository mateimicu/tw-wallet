import { Database } from "sqlite-async";

const DB_NAME = "session.sqlite";

const DB_SCHEMA = `
CREATE TABLE IF NOT EXISTS sessions (
  sessionId TEXT PRIMARY KEY,
  user_id INTEGER,
  validUntil TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName TEXT,
  password TEXT
);
`;


const DB_SEED = `
INSERT OR REPLACE INTO users (id, userName, password)
VALUES (1, 'matei', 'mateipassword');

INSERT OR REPLACE  INTO users (id, userName, password)
VALUES (2, 'a1', 'password_a1');

INSERT OR REPLACE  INTO users (id, userName, password)
VALUES (3, 'a2', 'password_a2');

INSERT OR REPLACE  INTO users (id, userName, password)
VALUES (4, 'test', 'test');

`;

export class DbHelper {
  constructor(dbName = DB_NAME) {
    this.db = Database.open(dbName);
  }

  async getDbConnection() {
    return await this.db;
  }

  async closeDbConnection() {
    await this.db.close();
  }
}



export class SchemaInitializer {
  constructor(db) {
    this.db = db;
  }

  async initDbSchema() {
    await this.db.exec(DB_SCHEMA);
  }
}


export class SeedInitializer {
  constructor(db) {
    this.db = db;
  }

  async initDbSeed() {
    await this.db.exec(DB_SEED);
  }
}

