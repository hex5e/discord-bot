"""Message create event handler."""
import discord
from src.commands.registry import handle_command
from src.utils.logger import logger


async def execute(message: discord.Message):
    """Execute message create event."""
    # Ignore bot messages
    if message.author.bot:
        return

    # Try to handle as a command
    try:
        await handle_command(message)
    except Exception as err:
        logger.error('Error handling command', {'error': str(err)})
