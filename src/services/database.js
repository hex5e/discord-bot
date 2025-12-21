class DatabaseService {
  constructor() {
    this.connected = false;
    this.store = new Map();
  }

  async connect() {
    this.connected = true;
    return this.connected;
  }

  async disconnect() {
    this.connected = false;
  }

  async set(key, value) {
    this.store.set(key, value);
  }

  async get(key) {
    return this.store.get(key);
  }

  async delete(key) {
    this.store.delete(key);
  }
}

const database = new DatabaseService();
export default database;
