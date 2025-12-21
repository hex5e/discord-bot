import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import logger from '../utils/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands?.get(interaction.commandName);
      if (!command) {
        logger.warn(`No command handler found for ${interaction.commandName}`);
        await interaction.reply({ content: 'Command not found.', ephemeral: true });
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}`, error);
        const content = 'There was an error executing that command.';
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content, ephemeral: true });
        } else {
          await interaction.reply({ content, ephemeral: true });
        }
      }
      return;
    }

    if (interaction.isButton() && interaction.customId === 'open_modal') {
      const modal = new ModalBuilder().setCustomId('hello_modal').setTitle('Hello Modal');
      const input = new TextInputBuilder()
        .setCustomId('modal_input')
        .setLabel('Message')
        .setStyle(TextInputStyle.Short)
        .setValue('hello!')
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      await interaction.showModal(modal);
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId === 'hello_modal') {
      const submitted = interaction.fields.getTextInputValue('modal_input');
      const dismissButton = new ButtonBuilder()
        .setCustomId('dismiss_message')
        .setLabel('Dismiss')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(dismissButton);
      await interaction.reply({ content: submitted, components: [row] });
      return;
    }

    if (interaction.isButton() && interaction.customId === 'dismiss_message') {
      try {
        if (interaction.message) await interaction.message.delete();
        await interaction.reply({ content: 'Message dismissed.', ephemeral: true });
      } catch (error) {
        logger.error('Failed to dismiss message', error);
        await interaction.reply({ content: "Couldn't delete message.", ephemeral: true });
      }
    }
  },
};
