import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { reverseString } from '../utils/helpers.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const prefix = config.prefix ?? '!';
    if (!message.content.startsWith(prefix)) return;

    const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = commandName?.toLowerCase();

    if (command === 'hello') {
      if (message.guild) logger.info(`Message from guild: ${message.guild.name} (${message.guild.id})`);

      const button = new ButtonBuilder().setCustomId('open_modal').setLabel('Open Modal').setStyle(ButtonStyle.Primary);
      const row = new ActionRowBuilder().addComponents(button);

      await message.reply({ content: 'Click to open the modal', components: [row] });
      return;
    }

    if (command === 'reverse') {
      if (args.length === 0) {
        await message.reply('Usage: !reverse <word-or-phrase>');
        return;
      }

      const reversed = reverseString(args.join(' '));
      await message.reply(`your word spelled backwards is ${reversed}`);
      return;
    }
  },
};
