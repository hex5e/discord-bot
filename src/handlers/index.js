import { handleMessage } from './messageHandler.js';
import { handleInteraction } from './interactionHandler.js';
import { handleReady } from './readyHandler.js';
import logger from '../utils/logger.js';

export function registerHandlers(client) {
  // Ready event (fires once when bot connects)
  client.once('ready', () => {
    handleReady(client);
  });

  // Message events
  client.on('messageCreate', (message) => {
    handleMessage(message).catch((err) => {
      logger.error('Error handling message', { error: err.message });
    });
  });

  // Interaction events (buttons, modals, etc.)
  client.on('interactionCreate', (interaction) => {
    handleInteraction(interaction).catch((err) => {
      logger.error('Error handling interaction', { error: err.message });
    });
  });

  logger.debug('Event handlers registered');
}

export { handleMessage, handleInteraction, handleReady };
export default { registerHandlers };
