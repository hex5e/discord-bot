from . import ready
from . import message_create
from . import interaction_create
from ..utils.logger import logger

events = [ready, message_create, interaction_create]

def register_events(client):
    """Register all event handlers with the Discord client."""

    @client.event
    async def on_ready():
        try:
            await ready.execute(client)
        except Exception as err:
            logger.error(f"Error in ready event: {err}")

    @client.event
    async def on_message(message):
        try:
            await message_create.execute(message)
        except Exception as err:
            logger.error(f"Error in message event: {err}")

    @client.event
    async def on_interaction(interaction):
        try:
            await interaction_create.execute(interaction)
        except Exception as err:
            logger.error(f"Error in interaction event: {err}")

    logger.debug("Events registered")

__all__ = ["register_events", "events"]
