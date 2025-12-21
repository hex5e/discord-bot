import hello from './hello.js';
import ping from './ping.js';
import getNumericIds from './get_numeric_ids.js';

const commands = [hello, ping];
const slashCommands = [getNumericIds];

export function handleCommand(message) {
  for (const command of commands) {
    if (message.content.startsWith(command.prefix)) {
      return command.execute(message);
    }
  }
  return null;
}

export { commands, slashCommands };
export default { handleCommand, commands, slashCommands };
