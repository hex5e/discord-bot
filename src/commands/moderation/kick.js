import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .addUserOption((option) => option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: 'User is not in this server.', ephemeral: true });
      return;
    }

    if (!member.kickable) {
      await interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
      return;
    }

    await member.kick(reason);
    await interaction.reply({ content: `${user.tag} has been kicked. Reason: ${reason}`, ephemeral: false });
  },
};
