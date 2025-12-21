import logger from '../utils/logger.js';

// Note: Discord.js handles heartbeat/keep-alive internally.
// This module provides utilities for custom heartbeat logic.

const DEFAULT_INTERVAL = 30000;
const DEFAULT_TIMEOUT = 10000;

export class HeartbeatManager {
  constructor(options = {}) {
    this.interval = options.interval || DEFAULT_INTERVAL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.heartbeatTimer = null;
    this.timeoutTimer = null;
    this.lastHeartbeat = null;
    this.onTimeoutCallback = null;
  }

  start(sendPingFn) {
    this.stop();

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat(sendPingFn);
    }, this.interval);

    logger.debug('Heartbeat started', { interval: this.interval });
  }

  stop() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    logger.debug('Heartbeat stopped');
  }

  sendHeartbeat(sendPingFn) {
    this.lastHeartbeat = Date.now();

    // Set timeout for pong response
    this.timeoutTimer = setTimeout(() => {
      logger.warn('Heartbeat timeout - no pong received');
      if (this.onTimeoutCallback) {
        this.onTimeoutCallback();
      }
    }, this.timeout);

    try {
      sendPingFn();
      logger.debug('Heartbeat ping sent');
    } catch (err) {
      logger.error('Failed to send heartbeat', { error: err.message });
    }
  }

  receivePong() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }

    const latency = this.lastHeartbeat ? Date.now() - this.lastHeartbeat : 0;
    logger.debug('Heartbeat pong received', { latency });
  }

  onTimeout(callback) {
    this.onTimeoutCallback = callback;
  }
}

export default HeartbeatManager;
