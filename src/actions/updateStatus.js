export const updateStatus = async (client, presence, logger) => {
  if (!presence || !client?.user) return;

  try {
    await client.user.setPresence(presence);
    logger?.info('Presence updated.');
  } catch (error) {
    logger?.warn(`Unable to update presence: ${error.message}`);
  }
};
