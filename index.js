import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!reverse')) return;
  
  const args = message.content.slice(8).trim();
  if (!args) return;
  
  const reversed = args.split('').reverse().join('');
  message.reply(`you're word spelled backwards is ${reversed}`);
});

client.login(process.env.DISCORD_TOKEN);