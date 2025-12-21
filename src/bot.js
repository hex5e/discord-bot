import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.commands = new Collection();

  return client;
}

export async function loadEvents(client) {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = await fs.readdir(eventsPath);

  for (const file of eventFiles) {
    if (!file.endsWith('.js')) continue;

    const event = await import(join(eventsPath, file));

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }

    logger.debug(`Loaded event: ${event.name}`);
  }

  logger.info(`Loaded ${eventFiles.filter((f) => f.endsWith('.js')).length} events`);
}

export async function loadCommands(client) {
  const commandsPath = join(__dirname, 'commands');
  const commands = [];

  async function loadFromDir(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await loadFromDir(fullPath);
      } else if (entry.name.endsWith('.js')) {
        const command = await import(fullPath);

        if (command.data && command.execute) {
          client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
          logger.debug(`Loaded command: ${command.data.name}`);
        }
      }
    }
  }

  await loadFromDir(commandsPath);
  logger.info(`Loaded ${commands.length} commands`);

  return commands;
}

export async function registerSlashCommands(commands) {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.DEV_GUILD_ID;

  if (!token || !clientId) {
    logger.warn('Missing DISCORD_TOKEN or CLIENT_ID - skipping slash command registration');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    logger.info(`Refreshing ${commands.length} slash commands...`);

    // Register to a specific guild for development (faster updates)
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      logger.info(`Registered commands to guild ${guildId}`);
    } else {
      // Register globally (takes up to an hour to propagate)
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      logger.info('Registered commands globally');
    }
  } catch (error) {
    logger.error('Failed to register slash commands:', error);
  }
}

export default {
  createClient,
  loadEvents,
  loadCommands,
  registerSlashCommands,
};
