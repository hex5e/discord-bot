import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import logger from '../utils/logger.js';

export async function sendMessage(channel, content, options = {}) {
  try {
    const message = await channel.send({ content, ...options });
    logger.debug('Message sent', { channelId: channel.id });
    return message;
  } catch (err) {
    logger.error('Failed to send message', { error: err.message, channelId: channel.id });
    throw err;
  }
}

export async function sendMessageWithButton(channel, content, buttonConfig) {
  const button = new ButtonBuilder()
    .setCustomId(buttonConfig.customId)
    .setLabel(buttonConfig.label)
    .setStyle(buttonConfig.style || ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  return sendMessage(channel, content, { components: [row] });
}

export async function replyToMessage(message, content, options = {}) {
  try {
    const reply = await message.reply({ content, ...options });
    logger.debug('Replied to message', { messageId: message.id });
    return reply;
  } catch (err) {
    logger.error('Failed to reply to message', { error: err.message, messageId: message.id });
    throw err;
  }
}

export default {
  sendMessage,
  sendMessageWithButton,
  replyToMessage,
};
