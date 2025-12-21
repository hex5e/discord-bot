class Heartbeat {
  constructor(client, intervalMs = 30000, logger) {
    this.client = client;
    this.intervalMs = intervalMs;
    this.logger = logger;
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const ping = this.client.ws?.ping;
      if (typeof ping === 'number') {
        this.logger?.debug(`Gateway heartbeat: ${ping}ms`);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default Heartbeat;
