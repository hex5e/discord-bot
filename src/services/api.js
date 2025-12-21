export const fetchHealth = async (logger) => {
  logger?.debug('API health check called');
  return { status: 'ok', timestamp: new Date().toISOString() };
};
