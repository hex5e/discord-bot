import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('List available commands'),
  async execute(interaction) {
    const commandList = interaction.client.commands
      ? [...interaction.client.commands.keys()].join(', ')
      : 'No commands registered';

    await interaction.reply({
      content: `Available commands: ${commandList}`,
      ephemeral: true,
    });
  },
};
