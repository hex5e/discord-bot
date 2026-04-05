"""Crawl local (Columbus, OH) jobs command handler."""
import discord
from src.utils.crawler import build_jobs_attachment_response, crawl_jobs
from src.utils.constants import CRAWLER
from src.utils.logger import logger


PREFIX = "!crawl-local"


async def execute(message: discord.Message, client: discord.Client):
    """Execute crawl-local command."""
    reply = await message.reply("🔍 Crawling for tech jobs in Columbus...")

    try:
        jobs = await crawl_jobs(location=CRAWLER["LOCATION_COLUMBUS"])
        content, attachments = build_jobs_attachment_response(jobs, "Columbus")
        await reply.edit(content=content, attachments=attachments)
    except Exception as error:
        logger.error("Crawl local error:", {"error": str(error)})
        await reply.edit(content="❌ Error crawling jobs. Check logs for details.")
