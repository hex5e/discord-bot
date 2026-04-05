"""Crawl local (Columbus, OH) jobs command handler."""
import discord
from src.utils.crawler import crawl_jobs, format_jobs_message
from src.utils.constants import CRAWLER
from src.utils.logger import logger


PREFIX = "!crawl-local"


async def execute(message: discord.Message, client: discord.Client):
    """Execute crawl-local command."""
    reply = await message.reply("🔍 Crawling for tech jobs in Columbus...")

    try:
        jobs = await crawl_jobs(location=CRAWLER["LOCATION_COLUMBUS"])
        await reply.edit(content=format_jobs_message(jobs, "Columbus"))
    except Exception as error:
        logger.error("Crawl local error:", {"error": str(error)})
        await reply.edit(content="❌ Error crawling jobs. Check logs for details.")
