"""Event registry."""
import discord
from src.events import ready, message_create, interaction_create
from src.utils.logger import logger


def register_events(client: discord.Client):
    """Register all event handlers."""

    @client.event
    async def on_ready():
        """Handle ready event."""
        await ready.execute(client)

    @client.event
    async def on_message(message: discord.Message):
        """Handle message create event."""
        try:
            await message_create.execute(message)
        except Exception as err:
            logger.error('Error in on_message event', {'error': str(err)})

    @client.event
    async def on_interaction(interaction: discord.Interaction):
        """Handle interaction create event."""
        try:
            await interaction_create.execute(interaction)
        except Exception as err:
            logger.error('Error in on_interaction event', {'error': str(err)})

    logger.debug('Events registered')
