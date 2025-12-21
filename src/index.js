import 'dotenv/config';
import { createClient, loadEvents, loadCommands, registerSlashCommands } from './bot.js';
import { loadConfig } from './utils/config.js';
import logger from './utils/logger.js';

async function main() {
  // Load configuration
  await loadConfig();

  // Create the Discord client
  const client = createClient();

  // Load events and commands
  await loadEvents(client);
  const commands = await loadCommands(client);

  // Register slash commands with Discord
  await registerSlashCommands(commands);

  // Login to Discord
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    logger.error('DISCORD_TOKEN environment variable is required');
    process.exit(1);
  }

  await client.login(token);
}

main().catch((error) => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});
