import os
import discord
from .events import register_events
from .utils.logger import logger

class Bot:
    """Main bot class that manages the Discord client."""

    def __init__(self, options=None):
        """Initialize the bot with optional configuration."""
        if options is None:
            options = {}

        # Set up intents
        intents = options.get("intents")
        if intents is None:
            intents = discord.Intents.default()
            intents.guilds = True
            intents.guild_messages = True
            intents.message_content = True

        # Create Discord client
        self.client = discord.Client(intents=intents)

        # Get token from options or environment
        self.token = options.get("token") or os.getenv("DISCORD_TOKEN")
        self.is_running = False

    def setup(self):
        """Set up event handlers and other bot configuration."""
        register_events(self.client)
        logger.info("Bot setup complete")

    async def start(self):
        """Start the bot and connect to Discord."""
        if self.is_running:
            logger.warning("Bot is already running")
            return

        if not self.token:
            raise ValueError("No Discord token provided")

        self.setup()

        try:
            await self.client.start(self.token)
            self.is_running = True
            logger.info("Bot started successfully")
        except Exception as err:
            logger.error(f"Failed to start bot: {err}")
            raise

    async def stop(self):
        """Stop the bot and disconnect from Discord."""
        if not self.is_running:
            logger.warning("Bot is not running")
            return

        try:
            await self.client.close()
            self.is_running = False
            logger.info("Bot stopped")
        except Exception as err:
            logger.error(f"Error stopping bot: {err}")
            raise

    def get_client(self):
        """Get the Discord client instance."""
        return self.client

def create_bot(options=None):
    """Factory function to create a Bot instance."""
    return Bot(options)

__all__ = ["Bot", "create_bot"]
