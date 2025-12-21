import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configDir = join(__dirname, '../../config');

let config = {};

export async function loadConfig() {
  const env = process.env.NODE_ENV || 'development';

  // Load default config
  try {
    const defaultConfig = JSON.parse(
      await fs.readFile(join(configDir, 'default.json'), 'utf8')
    );
    config = { ...defaultConfig };
  } catch (e) {
    // No default config file
  }

  // Override with environment-specific config
  if (env === 'production') {
    try {
      const prodConfig = JSON.parse(
        await fs.readFile(join(configDir, 'production.json'), 'utf8')
      );
      config = { ...config, ...prodConfig };
    } catch (e) {
      // No production config file
    }
  }

  return config;
}

export function getConfig() {
  return config;
}

export default { loadConfig, getConfig };
