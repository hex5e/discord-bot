import logger from '../utils/logger.js';

// Note: Discord.js handles reconnection internally.
// This module provides utilities for custom WebSocket reconnection logic.

const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BASE_DELAY = 1000;

export class ReconnectManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || DEFAULT_MAX_RETRIES;
    this.baseDelay = options.baseDelay || DEFAULT_BASE_DELAY;
    this.retryCount = 0;
    this.isReconnecting = false;
  }

  getDelay() {
    // Exponential backoff with jitter
    const delay = this.baseDelay * Math.pow(2, this.retryCount);
    const jitter = Math.random() * 1000;
    return delay + jitter;
  }

  async attemptReconnect(connectFn) {
    if (this.isReconnecting) {
      logger.debug('Already attempting reconnection');
      return false;
    }

    if (this.retryCount >= this.maxRetries) {
      logger.error('Max reconnection attempts reached');
      return false;
    }

    this.isReconnecting = true;
    this.retryCount++;

    const delay = this.getDelay();
    logger.info(`Reconnection attempt ${this.retryCount}/${this.maxRetries} in ${delay}ms`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      await connectFn();
      this.reset();
      logger.info('Reconnection successful');
      return true;
    } catch (err) {
      logger.error('Reconnection failed', { error: err.message });
      this.isReconnecting = false;
      return this.attemptReconnect(connectFn);
    }
  }

  reset() {
    this.retryCount = 0;
    this.isReconnecting = false;
  }
}

export default ReconnectManager;
