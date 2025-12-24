import discord
from ..utils.logger import logger

name = "hello"
prefix = "!hello"

async def execute(message):
    """Execute the hello command with a modal button."""
    if message.guild:
        logger.info(f"Message from guild: {message.guild.name}", extra={"guild_id": message.guild.id})

    button = discord.ui.Button(
        style=discord.ButtonStyle.primary,
        label="Open Modal",
        custom_id="open_modal"
    )

    view = discord.ui.View()
    view.add_item(button)

    await message.reply(content="Click to open the modal", view=view)

__all__ = ["name", "prefix", "execute"]
