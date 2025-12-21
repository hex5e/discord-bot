import { handleCommand } from '../commands/index.js';
import logger from '../utils/logger.js';

export const name = 'messageCreate';

export async function execute(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Try to handle as a command
  try {
    await handleCommand(message);
  } catch (err) {
    logger.error('Error handling command', { error: err.message });
  }
}

export default { name, execute };
