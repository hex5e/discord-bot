import logger from '../utils/logger.js';

export const name = 'guildMemberAdd';
export const once = false;

export async function execute(member) {
  logger.info(`New member joined: ${member.user.tag} in ${member.guild.name}`);

  // Example: Send a welcome message to the system channel
  const channel = member.guild.systemChannel;
  if (channel) {
    try {
      await channel.send(`Welcome to the server, ${member}!`);
    } catch (err) {
      logger.error('Failed to send welcome message:', err);
    }
  }
}

export default { name, once, execute };
