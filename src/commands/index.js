import hello from './hello.js';
import ping from './ping.js';

const commands = [hello, ping];

export function handleCommand(message) {
  for (const command of commands) {
    if (message.content.startsWith(command.prefix)) {
      return command.execute(message);
    }
  }
  return null;
}

export { commands };
export default { handleCommand, commands };
