const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLevel = process.env.LOG_LEVEL
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] ?? LOG_LEVELS.INFO
  : LOG_LEVELS.INFO;

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, message, ...args) {
  if (LOG_LEVELS[level] <= currentLevel) {
    const timestamp = formatTimestamp();
    console.log(`[${timestamp}] [${level}]`, message, ...args);
  }
}

export const logger = {
  error: (message, ...args) => log('ERROR', message, ...args),
  warn: (message, ...args) => log('WARN', message, ...args),
  info: (message, ...args) => log('INFO', message, ...args),
  debug: (message, ...args) => log('DEBUG', message, ...args),
};

export default logger;
