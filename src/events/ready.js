import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

const getStateFilePath = () => path.resolve(process.cwd(), config.oneTimeMessage?.stateFile ?? '.bot_state.json');

const loadState = async () => {
  const stateFile = getStateFilePath();
  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') logger.warn(`Unable to read state file: ${error.message}`);
    return {};
  }
};

const saveState = async (state) => {
  const stateFile = getStateFilePath();
  await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
};

const findWritableChannel = (guild, client) => {
  if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user)?.has(PermissionFlagsBits.SendMessages)) {
    return guild.systemChannel;
  }

  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.permissionsFor(client.user)?.has(PermissionFlagsBits.SendMessages),
  );
};

const sendOneTimeMessage = async (client) => {
  if (!config.devGuildId || !config.oneTimeMessage?.enabled) return;

  const state = await loadState();
  if (state[config.devGuildId]) {
    logger.info(`One-time message already sent for guild ${config.devGuildId}.`);
    return;
  }

  const guild = client.guilds.cache.get(config.devGuildId);
  if (!guild) {
    logger.warn(`Bot is not a member of guild ${config.devGuildId}.`);
    return;
  }

  const channel = findWritableChannel(guild, client);
  if (!channel) {
    logger.warn(`No writable channel found in guild ${config.devGuildId}.`);
    return;
  }

  const button = new ButtonBuilder().setCustomId('open_modal').setLabel('Open Modal').setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({ content: config.oneTimeMessage.content, components: [row] });
  state[config.devGuildId] = { createdAt: new Date().toISOString() };
  await saveState(state);
  logger.info(`One-time message sent to guild ${config.devGuildId}.`);
};

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user?.tag ?? 'Unknown User'}`);
    client.guilds.cache.forEach((guild) => logger.info(`Guild: ${guild.name} (${guild.id})`));

    try {
      await sendOneTimeMessage(client);
    } catch (error) {
      logger.error('Failed to send one-time message', error);
    }
  },
};
