const LEVELS = ['error', 'warn', 'info', 'debug'];

const shouldLog = (level, currentLevel) => {
  const targetIndex = LEVELS.indexOf(level);
  const currentIndex = LEVELS.indexOf(currentLevel);
  if (targetIndex === -1 || currentIndex === -1) return true;
  return targetIndex <= currentIndex;
};

const format = (level, message) => `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;

const logger = {
  level: process.env.LOG_LEVEL ?? 'info',
  debug(message) {
    if (shouldLog('debug', this.level)) console.debug(format('debug', message));
  },
  info(message) {
    if (shouldLog('info', this.level)) console.info(format('info', message));
  },
  warn(message) {
    if (shouldLog('warn', this.level)) console.warn(format('warn', message));
  },
  error(message, error) {
    if (shouldLog('error', this.level)) console.error(format('error', message), error ?? '');
  },
};

export default logger;
