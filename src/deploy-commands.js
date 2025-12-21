import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { slashCommands } from './commands/index.js';
import logger from './utils/logger.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) {
  logger.error('Missing DISCORD_TOKEN in environment variables');
  process.exit(1);
}

if (!clientId) {
  logger.error('Missing CLIENT_ID in environment variables');
  process.exit(1);
}

const commands = slashCommands.map(command => command.data.toJSON());

const rest = new REST().setToken(token);

async function deployCommands() {
  try {
    logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    let data;
    if (guildId) {
      // Deploy to specific guild (faster for development)
      logger.info(`Deploying commands to guild ${guildId}`);
      data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
    } else {
      // Deploy globally (takes up to 1 hour to update)
      logger.info('Deploying commands globally');
      data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
    }

    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error('Error deploying commands:', { error: error.message });
    throw error;
  }
}

deployCommands();
