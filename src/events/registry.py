"""Event registry."""
import discord
from src.events import ready, message_create
from src.utils.logger import logger


def register_events(client: discord.Client):
    """Register all event handlers."""

    @client.event
    async def on_ready():
        await ready.execute(client)

    @client.event
    async def on_message(message: discord.Message):
        try:
            await message_create.execute(message, client)
        except Exception as err:
            logger.error('Error in on_message', {'error': str(err)})
