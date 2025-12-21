import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.resolve(__dirname, '../../config');

let config = null;

export async function loadConfig() {
  if (config) return config;

  const env = process.env.NODE_ENV || 'development';

  // Load default config
  const defaultPath = path.join(CONFIG_DIR, 'default.json');
  let defaultConfig = {};
  try {
    const raw = await fs.readFile(defaultPath, 'utf8');
    defaultConfig = JSON.parse(raw);
  } catch (e) {
    // No default config file
  }

  // Load environment-specific config
  const envPath = path.join(CONFIG_DIR, `${env}.json`);
  let envConfig = {};
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    envConfig = JSON.parse(raw);
  } catch (e) {
    // No environment-specific config
  }

  // Merge configs (env overrides default)
  config = { ...defaultConfig, ...envConfig };

  return config;
}

export function getConfig() {
  if (!config) {
    throw new Error('Config not loaded. Call loadConfig() first.');
  }
  return config;
}

export default { loadConfig, getConfig };
