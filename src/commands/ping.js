import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction) {
    const reply = `Pong! Latency: ${Math.round(interaction.client.ws.ping)}ms`;
    await interaction.reply({ content: reply, ephemeral: true });
  },
};
