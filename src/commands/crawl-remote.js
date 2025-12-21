import { crawl as crawlRemote } from '../api/crawler-remote.js';
import logger from '../utils/logger.js';

export const name = 'crawl-remote';
export const prefix = '!crawl-remote';

/**
 * Format jobs array into a Discord message (max 2000 chars)
 */
function formatJobsMessage(jobs, type) {
  let content = `✅ Found **${jobs.length}** ${type} jobs:\n\n`;
  const maxLen = 2000;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const remoteTag = job.isRemote ? ' 🏠' : '';
    let line = `**${i + 1}. ${job.title}** @ ${job.company}${remoteTag}\n`;
    if (job.salary) line += `   💰 ${job.salary}\n`;
    line += `   📍 ${job.location}\n`;
    line += `   🔗 ${job.link}\n\n`;

    if (content.length + line.length > maxLen - 50) {
      content += `_...and ${jobs.length - i} more jobs_`;
      break;
    }
    content += line;
  }

  return content;
}

export async function execute(message) {
  const reply = await message.reply('🔍 Crawling for remote tech jobs...');
  try {
    const jobs = await crawlRemote();
    await reply.edit(formatJobsMessage(jobs, 'remote'));
  } catch (error) {
    logger.error('Crawl error:', error);
    await reply.edit('❌ Error crawling remote jobs. Check console for details.');
  }
}

export default { name, prefix, execute };
