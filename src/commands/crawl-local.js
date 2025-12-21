import { crawl as crawlLocal } from '../api/crawler-local.js';
import logger from '../utils/logger.js';

export const name = 'crawl-local';
export const prefix = '!crawl-local';

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
  const reply = await message.reply('🔍 Crawling for tech jobs in Columbus...');
  try {
    const jobs = await crawlLocal();
    await reply.edit(formatJobsMessage(jobs, 'Columbus'));
  } catch (error) {
    logger.error('Crawl error:', error);
    await reply.edit('❌ Error crawling jobs. Check console for details.');
  }
}

export default { name, prefix, execute };
