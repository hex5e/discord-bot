export const name = 'ping';
export const prefix = '!ping';

export async function execute(message) {
  const sent = await message.reply('Pinging...');

  const messageLatency = sent.createdTimestamp - message.createdTimestamp;
  const gatewayLatency = message.client.ws.ping;

  await sent.edit(
    `🏓 Pong!\nMessage latency: ${messageLatency}ms\nGateway latency: ${gatewayLatency}ms`
  );
}

export default { name, prefix, execute };
