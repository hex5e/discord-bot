import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import logger from '../utils/logger.js';

export async function handleMessage(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Command: !hello -> send a message with a button that opens a modal
  if (message.content.startsWith('!hello')) {
    if (message.guild) {
      logger.info(`Message from guild: ${message.guild.name}`, { guildId: message.guild.id });
    }

    const button = new ButtonBuilder()
      .setCustomId('open_modal')
      .setLabel('Open Modal')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.reply({ content: 'Click to open the modal', components: [row] });
  }
}

export default handleMessage;
