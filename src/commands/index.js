import hello from './hello.js';

const commands = [hello];

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
