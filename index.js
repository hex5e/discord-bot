const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!reverse';

if (!TOKEN) {
  console.error('Missing DISCORD_TOKEN in environment (create a .env file or set DISCORD_TOKEN).');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // ignore bots
  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim();
  if (!args) {
    return message.reply(`Usage: ${PREFIX} <word-or-phrase>`);
  }

  // Reverse the entire argument string
  const reversed = args.split('').reverse().join('');

  // Reply using the exact phrasing requested
  return message.reply(`you're word spelled backwards is ${reversed}`);
});

client.login(TOKEN).catch((err) => {
  console.error('Failed to login:', err);
});
