import { Client, GatewayIntentBits } from 'discord.js';
import { registerHandlers } from './handlers/index.js';
import logger from './utils/logger.js';

export class Bot {
  constructor(options = {}) {
    this.client = new Client({
      intents: options.intents || [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.token = options.token || process.env.DISCORD_TOKEN;
    this.isRunning = false;
  }

  setup() {
    registerHandlers(this.client);
    logger.info('Bot setup complete');
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Bot is already running');
      return;
    }

    if (!this.token) {
      throw new Error('No Discord token provided');
    }

    this.setup();

    try {
      await this.client.login(this.token);
      this.isRunning = true;
      logger.info('Bot started successfully');
    } catch (err) {
      logger.error('Failed to start bot', { error: err.message });
      throw err;
    }
  }

  async stop() {
    if (!this.isRunning) {
      logger.warn('Bot is not running');
      return;
    }

    try {
      await this.client.destroy();
      this.isRunning = false;
      logger.info('Bot stopped');
    } catch (err) {
      logger.error('Error stopping bot', { error: err.message });
      throw err;
    }
  }

  getClient() {
    return this.client;
  }
}

export function createBot(options) {
  return new Bot(options);
}

export default Bot;
