"""Main entry point for the Discord bot."""
import asyncio
from dotenv import load_dotenv
from src.bot import Bot
from src.utils.logger import logger


async def main():
    load_dotenv()
    bot = Bot()
    try:
        await bot.start()
    except asyncio.CancelledError:
        logger.info('Shutting down...')
        await bot.stop()
    except Exception as err:
        logger.error('Failed to start bot', {'error': str(err)})
        raise


def entry():
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    entry()
