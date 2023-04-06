
export class Session {
  constructor(sessionId, validUntil, user) {
    this.id = sessionId;
    this.validUntil = validUntil;
    this.user = user;
  }

  async isValid() {
    // TODO: Verificati daca sesiunea inca este valida
    return true
  }
}


export class SessionRepository {
  constructor(db) {
    this.db = db;
  }

  async getSessions() {
    const sql = `SELECT * FROM sessions`;

    const sessions = await this.db.all(sql);

    return sessions;
  }

  async getSessionById(sessionId) {
    const sql = `SELECT * FROM sessions WHERE sessionId = ?`;

    const statement = await this.db.prepare(sql);

    return await statement.all([sessionId]);
  }

  async saveSession(session) {
    const sql = "INSERT INTO sessions (sessionId, user_id, validUntil) VALUES (?,?,?)";

    const statement = await this.db.prepare(sql);

    await statement.run([session.id, session.user.id, session.validUntil]);
  }

  async invalidateSessionById(sessionId) {
    // TODO: Implementat o metoda de invalidate a sesiunilor.
    // QUESTION: Care sunt motivele pentru care dorim sa invalidam sesiunea ?
  }
}

