import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import logger from '../utils/logger.js';
import { slashCommands } from '../commands/index.js';

export const name = 'interactionCreate';

export async function execute(interaction) {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = slashCommands.find(cmd => cmd.data.name === interaction.commandName);

    if (!command) {
      logger.warn(`No command found for ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      logger.error(`Error executing command ${interaction.commandName}`, { error: err.message });
      const errorMessage = 'There was an error executing this command!';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
    return;
  }

  // Only handle buttons and modal submits
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  // Button: open the modal
  if (interaction.isButton() && interaction.customId === 'open_modal') {
    await handleOpenModalButton(interaction);
    return;
  }

  // Modal submit: reply with the submitted text and a dismiss button
  if (interaction.isModalSubmit() && interaction.customId === 'hello_modal') {
    await handleModalSubmit(interaction);
    return;
  }

  // Dismiss button: delete the message that contains the button
  if (interaction.isButton() && interaction.customId === 'dismiss_message') {
    await handleDismissButton(interaction);
  }
}

async function handleOpenModalButton(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('hello_modal')
    .setTitle('Hello Modal');

  const input = new TextInputBuilder()
    .setCustomId('modal_input')
    .setLabel('Message')
    .setStyle(TextInputStyle.Short)
    .setValue('hello!')
    .setRequired(true);

  const row = new ActionRowBuilder().addComponents(input);
  modal.addComponents(row);

  await interaction.showModal(modal);
}

async function handleModalSubmit(interaction) {
  const submitted = interaction.fields.getTextInputValue('modal_input');

  const dismissButton = new ButtonBuilder()
    .setCustomId('dismiss_message')
    .setLabel('Dismiss')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(dismissButton);

  await interaction.reply({ content: submitted, components: [row] });
}

async function handleDismissButton(interaction) {
  try {
    if (interaction.message) {
      await interaction.message.delete();
    }
    await interaction.reply({ content: 'Message dismissed.', ephemeral: true });
  } catch (err) {
    logger.error('Failed to dismiss message', { error: err.message });
    await interaction.reply({ content: "Couldn't delete message.", ephemeral: true });
  }
}

export default { name, execute };
