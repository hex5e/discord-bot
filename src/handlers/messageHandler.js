import { sendModalButtonReply } from '../actions/sendMessage.js';

const HELLO_COMMAND = '!hello';

const messageHandler = async (message, { logger }) => {
  if (message.author?.bot) return;

  if (message.content?.startsWith(HELLO_COMMAND)) {
    if (message.guild) {
      logger?.info(`Message from guild: ${message.guild.name} (${message.guild.id})`);
    }

    await sendModalButtonReply(message, logger);
  }
};

export default messageHandler;
