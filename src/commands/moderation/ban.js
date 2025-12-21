import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import logger from '../../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a user from the server')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to ban').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the ban').setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';
  const member = interaction.guild.members.cache.get(user.id);

  if (!member) {
    await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    return;
  }

  if (!member.bannable) {
    await interaction.reply({
      content: 'I cannot ban this user. They may have higher permissions.',
      ephemeral: true,
    });
    return;
  }

  try {
    await member.ban({ reason });
    logger.info(`User ${user.tag} was banned by ${interaction.user.tag}. Reason: ${reason}`);
    await interaction.reply({ content: `Successfully banned ${user.tag}. Reason: ${reason}` });
  } catch (error) {
    logger.error('Failed to ban user:', error);
    await interaction.reply({ content: 'Failed to ban the user.', ephemeral: true });
  }
}

export default { data, execute };
