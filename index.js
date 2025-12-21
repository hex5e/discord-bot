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
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js';
import { promises as fs } from 'fs';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, list the guilds the bot is in
client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag ?? 'unknown user'}`);
  client.guilds.cache.forEach((g) => {
    console.log(`Guild: ${g.name} (${g.id})`);
  });

  // Attempt to send a one-time button message into the target guild (once only)
  (async () => {
    const targetGuildId = process.env.DEV_GUILD_ID;
    const stateFile = '.bot_state.json';

    // Load state file (if present)
    let state = {};
    try {
      const raw = await fs.readFile(stateFile, 'utf8');
      state = JSON.parse(raw);
    } catch (e) {
      // file may not exist yet — that's fine
    }

    if (state[targetGuildId]) {
      console.log(`One-time button already created for guild ${targetGuildId}, skipping.`);
      return;
    }

    const guild = client.guilds.cache.get(targetGuildId);
    if (!guild) {
      console.log(`Bot is not a member of guild ${targetGuildId} — skipping one-time message.`);
      return;
    }

    // Find a suitable text channel where the bot can send messages.
    let channel = null;
    if (guild.systemChannel) channel = guild.systemChannel;
    if (!channel) {
      channel = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.permissionsFor(client.user)?.has(PermissionFlagsBits.SendMessages));
    }

    if (!channel) {
      console.log(`No channel found in guild ${targetGuildId} where bot can send messages.`);
      return;
    }

    try {
      const button = new ButtonBuilder()
        .setCustomId('open_modal')
        .setLabel('Open Modal')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({ content: 'A one-time message with a button (click to open modal)', components: [row] });

      // Persist that we've sent this message so we don't send it again
      state[targetGuildId] = { createdAt: new Date().toISOString() };
      await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
      console.log(`One-time button message sent and recorded for guild ${targetGuildId}`);
    } catch (err) {
      console.error(`Failed to send one-time message to guild ${targetGuildId}:`, err);
    }
  })();
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  // command: !hello -> send a message with a button that opens a modal
  if (message.content.startsWith('!hello')) {
    // log server (guild) info for this message
    if (message.guild) console.log(`Message from guild: ${message.guild.name} (${message.guild.id})`);
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