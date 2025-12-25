"""Crawl remote jobs command handler."""
import discord
from src.api.crawler_remote import crawl
from src.utils.logger import logger


NAME = 'crawl-remote'
PREFIX = '!crawl-remote'


def format_jobs_message(jobs: list, job_type: str) -> str:
    """Format jobs array into a Discord message (max 2000 chars)."""
    content = f"✅ Found **{len(jobs)}** {job_type} jobs:\n\n"
    max_len = 2000

    for i, job in enumerate(jobs):
        remote_tag = ' 🏠' if job.get('isRemote') else ''
        line = f"**{i + 1}. {job['title']}** @ {job['company']}{remote_tag}\n"
        if job.get('salary'):
            line += f"   💰 {job['salary']}\n"
        line += f"   📍 {job['location']}\n"
        line += f"   🔗 {job['link']}\n\n"

        if len(content) + len(line) > max_len - 50:
            content += f"_...and {len(jobs) - i} more jobs_"
            break
        content += line

    return content


async def execute(message: discord.Message):
    """Execute crawl-remote command."""
    reply = await message.reply('🔍 Crawling for remote tech jobs...')
    try:
        jobs = await crawl()
        await reply.edit(content=format_jobs_message(jobs, 'remote'))
    except Exception as error:
        logger.error('Crawl error:', {'error': str(error)})
        await reply.edit(content='❌ Error crawling remote jobs. Check console for details.')
