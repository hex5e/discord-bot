import { ChannelType, PermissionFlagsBits } from 'discord.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

const findWelcomeChannel = (guild) => {
  if (config.welcomeChannelId) {
    const channel = guild.channels.cache.get(config.welcomeChannelId);
    if (channel && channel.permissionsFor(guild.members.me ?? guild.client.user)?.has(PermissionFlagsBits.SendMessages)) {
      return channel;
    }
  }

  const systemChannel = guild.systemChannel;
  if (systemChannel && systemChannel.permissionsFor(guild.members.me ?? guild.client.user)?.has(PermissionFlagsBits.SendMessages)) {
    return systemChannel;
  }

  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.permissionsFor(guild.members.me ?? guild.client.user)?.has(PermissionFlagsBits.SendMessages),
  );
};

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    const channel = findWelcomeChannel(member.guild);
    if (!channel) {
      logger.warn(`No welcome channel available in guild ${member.guild.id}.`);
      return;
    }

    const message = `${config.welcomeMessage ?? 'Welcome to the server!'} ${member}`;
    await channel.send({ content: message });
  },
};
