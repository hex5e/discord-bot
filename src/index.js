import config from './utils/config.js';
import logger from './utils/logger.js';
import { createBot } from './bot.js';

const start = async () => {
  if (!config.token) {
    logger.error('DISCORD_TOKEN is missing. Please set it in your environment or .env file.');
    process.exitCode = 1;
    return;
  }

  try {
    const client = await createBot();
    await client.login(config.token);
  } catch (error) {
    logger.error('Failed to start the bot', error);
    process.exitCode = 1;
  }
};

start();
