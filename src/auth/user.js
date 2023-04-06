export class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async getUsers() {
    const sql = `SELECT * FROM users`;

    const users = await this.db.all(sql);

    return users;
  }

  async geUserById(userId) {
    // TODO: Tema de Casa
  }

  async getUserByAuth(username, password) {
    const sql = `SELECT * FROM users WHERE userName = ? AND password = ?`;

    const statement = await this.db.prepare(sql);

    return await statement.all([username, password]);
  }

  async saveUser(user) {
    // TODO: Tema de Casa
  }
}

