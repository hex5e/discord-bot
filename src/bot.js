import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importModule = async (filePath) => import(pathToFileURL(filePath));

const getFilesRecursively = async (directory) => {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFilesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
};

const registerEvents = async (client) => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = await getFilesRecursively(eventsPath);

  for (const file of eventFiles) {
    const { default: event } = await importModule(file);
    if (!event?.name || !event?.execute) {
      logger.warn(`Skipping invalid event file: ${file}`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  logger.info(`Registered ${eventFiles.length} event handlers.`);
};

const loadCommands = async (client) => {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = await getFilesRecursively(commandsPath);
  const commandData = [];

  for (const file of commandFiles) {
    const { default: command } = await importModule(file);
    if (!command?.data || !command?.execute) {
      logger.warn(`Skipping invalid command file: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
    commandData.push(command.data.toJSON());
  }

  logger.info(`Loaded ${commandData.length} slash command definitions.`);
  return commandData;
};

const registerSlashCommands = async (commands) => {
  if (!config.clientId || !config.token) {
    logger.warn('Missing CLIENT_ID or DISCORD_TOKEN; skipping slash command registration.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  const route = config.devGuildId
    ? Routes.applicationGuildCommands(config.clientId, config.devGuildId)
    : Routes.applicationCommands(config.clientId);

  try {
    await rest.put(route, { body: commands });
    logger.info(`Registered ${commands.length} application command(s).`);
  } catch (error) {
    logger.error('Failed to register application commands', error);
  }
};

export const createBot = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

  client.commands = new Collection();

  const commands = await loadCommands(client);
  await registerEvents(client);
  await registerSlashCommands(commands);

  return client;
};

export default createBot;
