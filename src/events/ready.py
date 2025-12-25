"""Ready event handler."""
import discord
from src.utils.logger import logger


async def execute(client: discord.Client):
    """Execute ready event."""
    logger.info(f"Logged in as {client.user.name if client.user else 'unknown user'}")

    # Log guilds the bot is in
    for guild in client.guilds:
        logger.info(f"Guild: {guild.name}", {'guildId': guild.id})
