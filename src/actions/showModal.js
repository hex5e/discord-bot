import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import logger from '../utils/logger.js';

export async function showModal(interaction, modalConfig) {
  const modal = new ModalBuilder()
    .setCustomId(modalConfig.customId)
    .setTitle(modalConfig.title);

  if (modalConfig.inputs && Array.isArray(modalConfig.inputs)) {
    for (const inputConfig of modalConfig.inputs) {
      const input = new TextInputBuilder()
        .setCustomId(inputConfig.customId)
        .setLabel(inputConfig.label)
        .setStyle(inputConfig.style || TextInputStyle.Short);

      if (inputConfig.value) input.setValue(inputConfig.value);
      if (inputConfig.placeholder) input.setPlaceholder(inputConfig.placeholder);
      if (typeof inputConfig.required === 'boolean') input.setRequired(inputConfig.required);
      if (inputConfig.minLength) input.setMinLength(inputConfig.minLength);
      if (inputConfig.maxLength) input.setMaxLength(inputConfig.maxLength);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
    }
  }

  try {
    await interaction.showModal(modal);
    logger.debug('Modal shown', { modalId: modalConfig.customId });
  } catch (err) {
    logger.error('Failed to show modal', { error: err.message, modalId: modalConfig.customId });
    throw err;
  }
}

export default showModal;
