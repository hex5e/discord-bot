import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption((option) => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason for the ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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

    if (!member.bannable) {
      await interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
      return;
    }

    await member.ban({ reason });
    await interaction.reply({ content: `${user.tag} has been banned. Reason: ${reason}`, ephemeral: false });
  },
};
