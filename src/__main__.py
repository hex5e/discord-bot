import asyncio
import signal
import os
from dotenv import load_dotenv
from .bot import Bot
from .utils.config import load_config
from .utils.logger import logger

async def main():
    """Main entry point for the Discord bot."""
    try:
        # Load environment variables
        load_dotenv()

        # Load configuration
        load_config()
        logger.info("Configuration loaded")

        # Create and start the bot
        bot = Bot()

        # Set up signal handlers for graceful shutdown
        loop = asyncio.get_event_loop()

        def signal_handler():
            logger.info("Received shutdown signal, shutting down...")
            asyncio.create_task(shutdown(bot))

        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, signal_handler)

        # Start the bot
        await bot.start()

    except Exception as err:
        logger.error(f"Failed to start application: {err}")
        raise

async def shutdown(bot):
    """Gracefully shutdown the bot."""
    try:
        await bot.stop()
    except Exception as err:
        logger.error(f"Error during shutdown: {err}")
    finally:
        # Stop the event loop
        loop = asyncio.get_event_loop()
        loop.stop()

if __name__ == "__main__":
    asyncio.run(main())
