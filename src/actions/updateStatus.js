import { ActivityType } from 'discord.js';
import logger from '../utils/logger.js';

export function updateStatus(client, status, options = {}) {
  const activityType = options.type || ActivityType.Playing;

  try {
    client.user.setPresence({
      activities: [{ name: status, type: activityType }],
      status: options.status || 'online',
    });
    logger.info('Bot status updated', { status, type: activityType });
  } catch (err) {
    logger.error('Failed to update status', { error: err.message });
    throw err;
  }
}

export function setOnline(client) {
  client.user.setStatus('online');
  logger.debug('Status set to online');
}

export function setIdle(client) {
  client.user.setStatus('idle');
  logger.debug('Status set to idle');
}

export function setDnd(client) {
  client.user.setStatus('dnd');
  logger.debug('Status set to DND');
}

export default {
  updateStatus,
  setOnline,
  setIdle,
  setDnd,
};
