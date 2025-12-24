from ..commands import handle_command
from ..utils.logger import logger

name = "message"
once = False

async def execute(message):
    """Execute when a message is created."""
    # Ignore bot messages
    if message.author.bot:
        return

    # Try to handle as a command
    try:
        await handle_command(message)
    except Exception as err:
        logger.error(f"Error handling command: {err}")

__all__ = ["name", "once", "execute"]
