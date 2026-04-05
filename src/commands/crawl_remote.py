"""Crawl remote jobs command handler."""
import discord
from src.utils.crawler import build_jobs_attachment_response, crawl_jobs
from src.utils.constants import CRAWLER
from src.utils.logger import logger


PREFIX = "!crawl-remote"


async def execute(message: discord.Message, client: discord.Client):
    """Execute crawl-remote command."""
    reply = await message.reply("🔍 Crawling for remote tech jobs...")

    try:
        jobs = await crawl_jobs(
            location=CRAWLER["LOCATION_REMOTE"],
            is_remote=True,
        )
        content, attachments = build_jobs_attachment_response(jobs, "Remote")
        await reply.edit(content=content, attachments=attachments)
    except Exception as error:
        logger.error("Crawl remote error:", {"error": str(error)})
        await reply.edit(content="❌ Error crawling jobs. Check logs for details.")
