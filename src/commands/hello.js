import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import logger from '../utils/logger.js';

export const name = 'hello';
export const prefix = '!hello';

export async function execute(message) {
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

export default { name, prefix, execute };
