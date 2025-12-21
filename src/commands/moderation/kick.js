import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import logger from '../../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a user from the server')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to kick').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the kick').setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') || 'No reason provided';
  const member = interaction.guild.members.cache.get(user.id);

  if (!member) {
    await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    return;
  }

  if (!member.kickable) {
    await interaction.reply({
      content: 'I cannot kick this user. They may have higher permissions.',
      ephemeral: true,
    });
    return;
  }

  try {
    await member.kick(reason);
    logger.info(`User ${user.tag} was kicked by ${interaction.user.tag}. Reason: ${reason}`);
    await interaction.reply({ content: `Successfully kicked ${user.tag}. Reason: ${reason}` });
  } catch (error) {
    logger.error('Failed to kick user:', error);
    await interaction.reply({ content: 'Failed to kick the user.', ephemeral: true });
  }
}

export default { data, execute };
