import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import logger from '../utils/logger.js';

export const name = 'interactionCreate';
export const once = false;

export async function execute(interaction) {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    await handleSlashCommand(interaction);
    return;
  }

  // Handle button clicks
  if (interaction.isButton()) {
    await handleButton(interaction);
    return;
  }

  // Handle modal submits
  if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
    return;
  }
}

async function handleSlashCommand(interaction) {
  const { client, commandName } = interaction;
  const command = client.commands?.get(commandName);

  if (!command) {
    logger.warn(`No command matching ${commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${commandName}:`, error);
    const reply = { content: 'There was an error executing this command!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}

async function handleButton(interaction) {
  const { customId } = interaction;

  // Button: open the modal
  if (customId === 'open_modal') {
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
    return;
  }

  // Dismiss button: delete the message that contains the button
  if (customId === 'dismiss_message') {
    try {
      if (interaction.message) await interaction.message.delete();
      await interaction.reply({ content: 'Message dismissed.', ephemeral: true });
    } catch (err) {
      logger.error('Failed to dismiss message:', err);
      await interaction.reply({ content: "Couldn't delete message.", ephemeral: true });
    }
    return;
  }
}

async function handleModalSubmit(interaction) {
  const { customId } = interaction;

  // Modal submit: reply with the submitted text and a dismiss button
  if (customId === 'hello_modal') {
    const submitted = interaction.fields.getTextInputValue('modal_input');

    const dismissButton = new ButtonBuilder()
      .setCustomId('dismiss_message')
      .setLabel('Dismiss')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(dismissButton);

    await interaction.reply({ content: submitted, components: [row] });
    return;
  }
}

export default { name, once, execute };
