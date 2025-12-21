import 'dotenv/config';
import Bot from './bot.js';

const bot = new Bot();

bot.start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start the bot', error);
  process.exitCode = 1;
});
