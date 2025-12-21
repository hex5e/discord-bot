import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { ServiceError } from '../utils/errors.js';

class DatabaseService {
  constructor(logger, stateFile = '.bot_state.json') {
    this.logger = logger;
    this.stateFile = path.resolve(process.cwd(), stateFile);
  }

  async getState() {
    try {
      const content = await readFile(this.stateFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw new ServiceError(`Failed to read state file: ${error.message}`);
    }
  }

  async saveState(state) {
    try {
      await writeFile(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
      throw new ServiceError(`Failed to write state file: ${error.message}`);
    }
  }

  async markGuildMessageSent(guildId) {
    const state = await this.getState();
    state[guildId] = { createdAt: new Date().toISOString() };
    await this.saveState(state);
    this.logger?.info(`Recorded one-time message for guild ${guildId}`);
  }
}

export default DatabaseService;
