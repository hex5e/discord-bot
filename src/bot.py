"""Main bot class."""
import os
import discord
from src.events.registry import register_events
from src.utils.logger import logger


class Bot:
    """Discord bot class."""

    def __init__(self, token: str = None):
        intents = discord.Intents.default()
        intents.message_content = True
        self.client = discord.Client(intents=intents)
        self.token = token or os.getenv('DISCORD_TOKEN')

    async def start(self):
        if not self.token:
            raise ValueError('DISCORD_TOKEN not set')
        register_events(self.client)
        await self.client.start(self.token)

    async def stop(self):
        await self.client.close()
        logger.info('Bot stopped')
