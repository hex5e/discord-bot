"""Main entry point for the Discord bot."""
import os
import asyncio
import signal
from dotenv import load_dotenv
from src.bot import Bot
from src.utils.config import load_config
from src.utils.logger import logger


async def main():
    """Main function."""
    # Load environment variables
    load_dotenv()

    try:
        # Load configuration
        await load_config()
        logger.info('Configuration loaded')

        # Create and start the bot
        bot = Bot()

        # Handle graceful shutdown
        def signal_handler(sig, frame):
            """Handle shutdown signals."""
            logger.info(f'Received signal {sig}, shutting down...')
            asyncio.create_task(bot.stop())

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        await bot.start()

    except Exception as err:
        logger.error('Failed to start application', {'error': str(err)})
        raise


if __name__ == '__main__':
    asyncio.run(main())
