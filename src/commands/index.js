import hello from './hello.js';
import ping from './ping.js';
import crawlLocal from './crawl-local.js';
import crawlRemote from './crawl-remote.js';

const commands = [hello, ping, crawlLocal, crawlRemote];

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
