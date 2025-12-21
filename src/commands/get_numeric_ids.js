import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('get_numeric_ids')
  .setDescription('Show server ID and all channel IDs for reference');

export async function execute(interaction) {
  const guild = interaction.guild;

  let output = `**Server ID:** \`${guild.id}\`\n\n`;

  // Get categories and uncategorized channels
  const categories = guild.channels.cache.filter(c => c.type === 4);

  categories.forEach(category => {
    output += `**📁 ${category.name}** \`${category.id}\`\n`;

    // Get channels in this category
    const channelsInCategory = guild.channels.cache.filter(
      c => c.parentId === category.id
    );

    channelsInCategory.forEach(channel => {
      const icon = channel.type === 0 ? '📝' : channel.type === 2 ? '🔊' : '📌';
      output += `  ${icon} ${channel.name}: \`${channel.id}\`\n`;
    });
    output += '\n';
  });

  // Uncategorized channels
  const uncategorized = guild.channels.cache.filter(
    c => !c.parentId && c.type !== 4
  );

  if (uncategorized.size > 0) {
    output += `**Uncategorized:**\n`;
    uncategorized.forEach(channel => {
      output += `${channel.name}: \`${channel.id}\`\n`;
    });
  }

  await interaction.reply({ content: output, ephemeral: true });
}

export default { data, execute };
