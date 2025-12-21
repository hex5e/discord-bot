export class BotError extends Error {
  constructor(message, code = 'BOT_ERROR') {
    super(message);
    this.name = 'BotError';
    this.code = code;
  }
}

export class ConfigError extends BotError {
  constructor(message) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

export class HandlerError extends BotError {
  constructor(message) {
    super(message, 'HANDLER_ERROR');
    this.name = 'HandlerError';
  }
}

export class ConnectionError extends BotError {
  constructor(message) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

export default {
  BotError,
  ConfigError,
  HandlerError,
  ConnectionError,
};
