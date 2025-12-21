const LEVELS = ['error', 'warn', 'info', 'debug'];

const formatMessage = (level, message, metadata) => {
  const timestamp = new Date().toISOString();
  const suffix = metadata ? ` ${JSON.stringify(metadata)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${suffix}`;
};

export const createLogger = (level = 'info') => {
  const currentLevelIndex = LEVELS.indexOf(level);

  const shouldLog = (messageLevel) => {
    const messageLevelIndex = LEVELS.indexOf(messageLevel);
    return messageLevelIndex <= currentLevelIndex;
  };

  return {
    error: (message, metadata) => shouldLog('error') && console.error(formatMessage('error', message, metadata)),
    warn: (message, metadata) => shouldLog('warn') && console.warn(formatMessage('warn', message, metadata)),
    info: (message, metadata) => shouldLog('info') && console.info(formatMessage('info', message, metadata)),
    debug: (message, metadata) => shouldLog('debug') && console.debug(formatMessage('debug', message, metadata)),
  };
};
