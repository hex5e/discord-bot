import 'dotenv/config';
import { Bot } from './bot.js';
import { loadConfig } from './utils/config.js';
import logger from './utils/logger.js';

async function main() {
  try {
    // Load configuration
    await loadConfig();
    logger.info('Configuration loaded');

    // Create and start the bot
    const bot = new Bot();
    await bot.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down...');
      await bot.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down...');
      await bot.stop();
      process.exit(0);
    });
  } catch (err) {
    logger.error('Failed to start application', { error: err.message });
    process.exit(1);
  }
}

main();
