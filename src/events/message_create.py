"""Message create event handler."""
import discord
from src.commands.registry import handle_command
from src.utils.logger import logger


async def execute(message: discord.Message, client: discord.Client):
    """Execute message create event."""
    if message.author.bot:
        return
    try:
        await handle_command(message, client)
    except Exception as err:
        logger.error('Error handling command', {'error': str(err)})
