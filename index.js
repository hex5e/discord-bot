import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  // command: !hello -> send a message with a button that opens a modal
  if (message.content.startsWith('!hello')) {
    const button = new ButtonBuilder()
      .setCustomId('open_modal')
      .setLabel('Open Modal')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    message.reply({ content: 'Click to open the modal', components: [row] });
    return;
  }
  // other messages: ignore
});

// Interactions (button clicks and modal submits)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  // Button: open the modal
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

  // Modal submit: reply with the submitted text and a dismiss button
  if (interaction.isModalSubmit() && interaction.customId === 'hello_modal') {
    const submitted = interaction.fields.getTextInputValue('modal_input');

    const dismissButton = new ButtonBuilder()
      .setCustomId('dismiss_message')
      .setLabel('Dismiss')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(dismissButton);

    // Reply publicly with a dismiss button attached
    await interaction.reply({ content: submitted, components: [row] });
    return;
  }

  // Dismiss button: delete the message that contains the button
  if (interaction.isButton() && interaction.customId === 'dismiss_message') {
    try {
      if (interaction.message) await interaction.message.delete();
      // Acknowledge the interaction so the client doesn't show "This interaction failed"
      await interaction.reply({ content: 'Message dismissed.', ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: "Couldn't delete message.", ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);