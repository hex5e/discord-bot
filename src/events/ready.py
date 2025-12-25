from ..utils.logger import logger

name = "ready"
once = True

async def execute(client):
    """Execute when the bot is ready."""
    logger.info(f"Logged in as {client.user.name if client.user else 'unknown user'}")

    # Log guilds the bot is in
    for guild in client.guilds:
        logger.info(f"Guild: {guild.name}", extra={"guild_id": guild.id})

__all__ = ["name", "once", "execute"]
