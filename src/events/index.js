import ready from './ready.js';
import messageCreate from './messageCreate.js';
import interactionCreate from './interactionCreate.js';
import logger from '../utils/logger.js';

const events = [ready, messageCreate, interactionCreate];

export function registerEvents(client) {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => {
        event.execute(...args).catch((err) => {
          logger.error(`Error in ${event.name} event`, { error: err.message });
        });
      });
    }
  }

  logger.debug('Events registered');
}

export { events };
export default { registerEvents, events };
