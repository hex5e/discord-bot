import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} from 'discord.js';
import logger from '../utils/logger.js';
import { isGuildInitialized, markGuildInitialized } from '../utils/helpers.js';

export const name = 'ready';
export const once = true;

export async function execute(client) {
  logger.info(`Logged in as ${client.user?.tag ?? 'unknown user'}`);

  client.guilds.cache.forEach((g) => {
    logger.info(`Guild: ${g.name} (${g.id})`);
  });

  // Attempt to send a one-time button message into the target guild
  await sendOneTimeMessage(client);
}

async function sendOneTimeMessage(client) {
  const targetGuildId = process.env.DEV_GUILD_ID;
  if (!targetGuildId) return;

  if (await isGuildInitialized(targetGuildId)) {
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

    await markGuildInitialized(targetGuildId);
    logger.info(`One-time button message sent and recorded for guild ${targetGuildId}`);
  } catch (err) {
    logger.error(`Failed to send one-time message to guild ${targetGuildId}:`, err);
  }
}

export default { name, once, execute };
