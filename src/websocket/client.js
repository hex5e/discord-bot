import { Client, GatewayIntentBits } from 'discord.js';
import Heartbeat from './heartbeat.js';
import { setupReconnect } from './reconnect.js';

export const createWebsocketClient = (logger, config = {}) => {
  const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ];

  const client = new Client({ intents });
  const heartbeat = new Heartbeat(client, config.websocket?.heartbeatIntervalMs ?? 30000, logger);

  setupReconnect(client, logger, {
    onInvalidated: async () => {
      heartbeat.stop();
      try {
        await client.destroy();
      } catch (error) {
        logger?.warn(`Failed to destroy client during invalidation: ${error.message}`);
      }
    },
  });

  client.once('ready', () => heartbeat.start());

  return { client, heartbeat };
};
