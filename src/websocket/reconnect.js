export const setupReconnect = (client, logger, callbacks = {}) => {
  const { onInvalidated } = callbacks;

  client.on('shardError', (error, shardId) => {
    logger?.error(`Shard ${shardId ?? 'unknown'} error: ${error.message}`);
  });

  client.on('shardDisconnect', (event, shardId) => {
    logger?.warn(`Shard ${shardId ?? 'unknown'} disconnected (code: ${event.code})`);
  });

  client.on('shardReconnecting', (shardId) => {
    logger?.info(`Shard ${shardId ?? 'unknown'} reconnecting`);
  });

  client.on('shardResume', (shardId, replayedEvents) => {
    logger?.info(`Shard ${shardId ?? 'unknown'} resumed with ${replayedEvents} events`);
  });

  client.on('invalidated', async () => {
    logger?.warn('Session invalidated; attempting clean reconnect');
    if (onInvalidated) await onInvalidated();
  });
};
