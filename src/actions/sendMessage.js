import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export const buildOpenModalRow = () => new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('open_modal')
    .setLabel('Open Modal')
    .setStyle(ButtonStyle.Primary),
);

export const buildDismissRow = () => new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('dismiss_message')
    .setLabel('Dismiss')
    .setStyle(ButtonStyle.Secondary),
);

export const buildModal = () => {
  const modal = new ModalBuilder().setCustomId('hello_modal').setTitle('Hello Modal');
  const input = new TextInputBuilder()
    .setCustomId('modal_input')
    .setLabel('Message')
    .setStyle(TextInputStyle.Short)
    .setValue('hello!')
    .setRequired(true);

  const row = new ActionRowBuilder().addComponents(input);
  modal.addComponents(row);
  return modal;
};

export const sendOneTimeButton = async (channel, logger) => {
  const row = buildOpenModalRow();
  await channel.send({ content: 'A one-time message with a button (click to open modal)', components: [row] });
  logger?.info('One-time modal prompt sent.');
};

export const sendModalButtonReply = async (message, logger) => {
  const row = buildOpenModalRow();
  await message.reply({ content: 'Click to open the modal', components: [row] });
  logger?.info('Modal button reply sent.');
};

export const showModal = async (interaction, logger) => {
  const modal = buildModal();
  await interaction.showModal(modal);
  logger?.debug('Modal displayed to user.');
};

export const sendSubmittedResponse = async (interaction, submitted, logger) => {
  const row = buildDismissRow();
  await interaction.reply({ content: submitted, components: [row] });
  logger?.info('Submitted modal response delivered.');
};

export const dismissMessage = async (interaction, logger) => {
  try {
    if (interaction.message) {
      await interaction.message.delete();
    }
    await interaction.reply({ content: 'Message dismissed.', ephemeral: true });
    logger?.info('Message dismissed on user request.');
  } catch (error) {
    await interaction.reply({ content: "Couldn't delete message.", ephemeral: true });
    logger?.error(`Failed to dismiss message: ${error.message}`);
  }
};
