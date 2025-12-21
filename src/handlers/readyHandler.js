import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js';
import logger from '../utils/logger.js';
import { loadState, saveState } from '../services/state.js';

export async function handleReady(client) {
  logger.info(`Logged in as ${client.user?.tag ?? 'unknown user'}`);

  // Log guilds the bot is in
  client.guilds.cache.forEach((g) => {
    logger.info(`Guild: ${g.name}`, { guildId: g.id });
  });

  // Attempt to send a one-time button message into the target guild
  await sendOneTimeButtonMessage(client);
}

async function sendOneTimeButtonMessage(client) {
  const targetGuildId = process.env.DEV_GUILD_ID;
  if (!targetGuildId) {
    logger.debug('No DEV_GUILD_ID set, skipping one-time message');
    return;
  }

  const state = await loadState();

  if (state[targetGuildId]) {
    logger.info(`One-time button already created for guild ${targetGuildId}, skipping.`);
    return;
  }

  const guild = client.guilds.cache.get(targetGuildId);
  if (!guild) {
    logger.info(`Bot is not a member of guild ${targetGuildId} — skipping one-time message.`);
    return;
  }

  // Find a suitable text channel where the bot can send messages
  let channel = guild.systemChannel;
  if (!channel) {
    channel = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        c.permissionsFor(client.user)?.has(PermissionFlagsBits.SendMessages)
    );
  }

  if (!channel) {
    logger.info(`No channel found in guild ${targetGuildId} where bot can send messages.`);
    return;
  }

  try {
    const button = new ButtonBuilder()
      .setCustomId('open_modal')
      .setLabel('Open Modal')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await channel.send({
      content: 'A one-time message with a button (click to open modal)',
      components: [row],
    });

    // Persist that we've sent this message so we don't send it again
    state[targetGuildId] = { createdAt: new Date().toISOString() };
    await saveState(state);
    logger.info(`One-time button message sent and recorded for guild ${targetGuildId}`);
  } catch (err) {
    logger.error(`Failed to send one-time message to guild ${targetGuildId}`, { error: err.message });
  }
}

export default handleReady;
