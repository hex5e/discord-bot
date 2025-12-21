import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Shows available commands and bot information');

export async function execute(interaction) {
  const { client } = interaction;

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Bot Help')
    .setDescription('Here are the available commands:')
    .addFields(
      { name: '/ping', value: 'Check bot latency', inline: true },
      { name: '/help', value: 'Show this help message', inline: true },
      { name: '/ban', value: 'Ban a user (mod only)', inline: true },
      { name: '/kick', value: 'Kick a user (mod only)', inline: true },
      { name: '!hello', value: 'Opens a modal via button', inline: true }
    )
    .setFooter({ text: `${client.user.username}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

export default { data, execute };
