"""Main bot class."""
import os
import discord
from src.events.registry import register_events
from src.utils.logger import logger


class Bot:
    """Discord bot class."""

    def __init__(self, token: str = None, intents: discord.Intents = None):
        """
        Initialize the bot.

        Args:
            token: Discord bot token
            intents: Discord intents
        """
        if intents is None:
            intents = discord.Intents.default()
            intents.guilds = True
            intents.guild_messages = True
            intents.message_content = True

        self.client = discord.Client(intents=intents)
        self.token = token or os.getenv('DISCORD_TOKEN')
        self.is_running = False

    def setup(self):
        """Setup bot event handlers."""
        register_events(self.client)
        logger.info('Bot setup complete')

    async def start(self):
        """Start the bot."""
        if self.is_running:
            logger.warn('Bot is already running')
            return

        if not self.token:
            raise ValueError('No Discord token provided')

        self.setup()

        try:
            self.is_running = True
            await self.client.start(self.token)
            logger.info('Bot started successfully')
        except Exception as err:
            logger.error('Failed to start bot', {'error': str(err)})
            self.is_running = False
            raise

    async def stop(self):
        """Stop the bot."""
        if not self.is_running:
            logger.warn('Bot is not running')
            return

        try:
            await self.client.close()
            self.is_running = False
            logger.info('Bot stopped')
        except Exception as err:
            logger.error('Error stopping bot', {'error': str(err)})
            raise

    def get_client(self) -> discord.Client:
        """Get the Discord client."""
        return self.client
