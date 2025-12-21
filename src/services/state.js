import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.resolve(__dirname, '../../.bot_state.json');

export async function loadState() {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      logger.debug('State file does not exist, returning empty state');
      return {};
    }
    logger.error('Failed to load state file', { error: err.message });
    return {};
  }
}

export async function saveState(state) {
  try {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    logger.debug('State file saved');
  } catch (err) {
    logger.error('Failed to save state file', { error: err.message });
    throw err;
  }
}

export async function getStateValue(key) {
  const state = await loadState();
  return state[key];
}

export async function setStateValue(key, value) {
  const state = await loadState();
  state[key] = value;
  await saveState(state);
}

export async function deleteStateValue(key) {
  const state = await loadState();
  delete state[key];
  await saveState(state);
}

export default {
  loadState,
  saveState,
  getStateValue,
  setStateValue,
  deleteStateValue,
};
