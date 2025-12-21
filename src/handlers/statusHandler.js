const statusHandler = async (_client, { bot }) => {
  await bot.handleReady();
};

export default statusHandler;
