import messageHandler from './messageHandler.js';
import statusHandler from './statusHandler.js';
import { dismissMessage, sendSubmittedResponse, showModal } from '../actions/sendMessage.js';

const interactionHandler = async (interaction, { logger }) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  if (interaction.isButton() && interaction.customId === 'open_modal') {
    await showModal(interaction, logger);
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId === 'hello_modal') {
    const submitted = interaction.fields.getTextInputValue('modal_input');
    await sendSubmittedResponse(interaction, submitted, logger);
    return;
  }

  if (interaction.isButton() && interaction.customId === 'dismiss_message') {
    await dismissMessage(interaction, logger);
  }
};

const registerHandlers = (client, context) => {
  client.once('ready', () => {
    statusHandler(client, context);
  });

  client.on('messageCreate', (message) => {
    messageHandler(message, context);
  });

  client.on('interactionCreate', (interaction) => {
    interactionHandler(interaction, context);
  });
};

export default registerHandlers;
