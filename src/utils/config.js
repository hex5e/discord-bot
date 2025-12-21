import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'default';

const loadConfigFile = (name) => {
  const filePath = path.join(ROOT_DIR, 'config', `${name}.json`);
  if (!existsSync(filePath)) return {};

  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    logger.warn(`Unable to read config file ${filePath}: ${error.message}`);
    return {};
  }
};

const baseConfig = loadConfigFile('default');
const envConfig = nodeEnv === 'production' ? loadConfigFile('production') : {};

const config = {
  ...baseConfig,
  ...envConfig,
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  devGuildId: process.env.DEV_GUILD_ID ?? '',
};

export default config;
