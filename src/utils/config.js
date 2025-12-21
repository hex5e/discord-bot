import path from 'path';
import { readFile } from 'fs/promises';
import { ConfigError } from './errors.js';

const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;

  const output = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      output[key] = value.slice();
    } else if (typeof value === 'object' && value !== null) {
      output[key] = deepMerge(target[key] ?? {}, value);
    } else {
      output[key] = value;
    }
  });
  return output;
};

const readJsonFile = async (filePath) => {
  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    if (error.name === 'SyntaxError') throw new ConfigError(`Invalid JSON in ${filePath}`);
    throw error;
  }
};

export const loadConfig = async () => {
  const env = process.env.NODE_ENV || 'development';
  const configDir = path.resolve(process.cwd(), 'config');
  const defaultPath = path.join(configDir, 'default.json');
  const envPath = path.join(configDir, `${env}.json`);

  const baseConfig = await readJsonFile(defaultPath);
  const envConfig = await readJsonFile(envPath);

  const merged = deepMerge(baseConfig, envConfig);

  if (process.env.DISCORD_TOKEN) {
    merged.bot = {
      ...(merged.bot ?? {}),
      token: process.env.DISCORD_TOKEN,
    };
  }

  if (process.env.DEV_GUILD_ID) {
    merged.bot = {
      ...(merged.bot ?? {}),
      devGuildId: process.env.DEV_GUILD_ID,
    };
  }

  return merged;
};
