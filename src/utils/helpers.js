import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stateFile = join(__dirname, '../../.bot_state.json');

/**
 * Load the bot state from the state file
 */
export async function loadState() {
  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

/**
 * Save the bot state to the state file
 */
export async function saveState(state) {
  await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

/**
 * Check if a guild has already been initialized
 */
export async function isGuildInitialized(guildId) {
  const state = await loadState();
  return !!state[guildId];
}

/**
 * Mark a guild as initialized
 */
export async function markGuildInitialized(guildId) {
  const state = await loadState();
  state[guildId] = { createdAt: new Date().toISOString() };
  await saveState(state);
}

export default {
  loadState,
  saveState,
  isGuildInitialized,
  markGuildInitialized,
};
