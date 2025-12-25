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
    except KeyboardInterrupt:
        logger.info('Shutting down...')
        await bot.stop()
    except Exception as err:
        logger.error('Failed to start bot', {'error': str(err)})
        raise


if __name__ == '__main__':
    asyncio.run(main())
