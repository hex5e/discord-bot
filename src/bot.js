import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { loadConfig } from './utils/config.js';
import { createLogger } from './utils/logger.js';
import { ConfigError } from './utils/errors.js';
import DatabaseService from './services/database.js';
import { createWebsocketClient } from './websocket/client.js';
import registerHandlers from './handlers/index.js';
import { updateStatus } from './actions/updateStatus.js';
import { sendOneTimeButton } from './actions/sendMessage.js';

class Bot {
  constructor() {
    this.config = null;
    this.logger = null;
    this.client = null;
    this.database = null;
    this.heartbeat = null;
  }

  async start() {
    this.config = await loadConfig();
    this.logger = createLogger(this.config.logging?.level);
    this.database = new DatabaseService(this.logger, this.config.storage?.stateFile);

    const { client, heartbeat } = createWebsocketClient(this.logger, this.config);
    this.client = client;
    this.heartbeat = heartbeat;

    registerHandlers(this.client, {
      bot: this,
      logger: this.logger,
      config: this.config,
      database: this.database,
    });

    const token = this.getToken();
    if (!token) {
      throw new ConfigError('DISCORD_TOKEN is not set in environment or config');
    }

    await this.client.login(token);
  }

  getToken() {
    return process.env.DISCORD_TOKEN || this.config?.bot?.token;
  }

  getDevGuildId() {
    return process.env.DEV_GUILD_ID || this.config?.bot?.devGuildId;
  }

  async handleReady() {
    this.logger.info(`Logged in as ${this.client.user?.tag ?? 'unknown user'}`);
    this.client.guilds.cache.forEach((guild) => {
      this.logger.debug(`Guild: ${guild.name} (${guild.id})`);
    });

    await updateStatus(this.client, this.config?.bot?.presence, this.logger);
    await this.sendOneTimeMessage();
  }

  async sendOneTimeMessage() {
    const targetGuildId = this.getDevGuildId();
    if (!targetGuildId) {
      this.logger.warn('DEV_GUILD_ID not set; skipping one-time message.');
      return;
    }

    const state = await this.database.getState();
    if (state[targetGuildId]) {
      this.logger.info(`One-time button already created for guild ${targetGuildId}, skipping.`);
      return;
    }

    const guild = this.client.guilds.cache.get(targetGuildId);
    if (!guild) {
      this.logger.warn(`Bot is not a member of guild ${targetGuildId} — skipping one-time message.`);
      return;
    }

    let channel = guild.systemChannel;
    if (!channel) {
      channel = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText
          && c.permissionsFor(this.client.user)?.has(PermissionFlagsBits.SendMessages),
      );
    }

    if (!channel) {
      this.logger.warn(`No channel found in guild ${targetGuildId} where bot can send messages.`);
      return;
    }

    try {
      await sendOneTimeButton(channel, this.logger);
      await this.database.markGuildMessageSent(targetGuildId);
    } catch (error) {
      this.logger.error(`Failed to send one-time message to guild ${targetGuildId}: ${error.message}`);
    }
  }
}

export default Bot;
