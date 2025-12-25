"""Hello command handler."""
import discord
from src.utils.logger import logger


NAME = 'hello'
PREFIX = '!hello'


async def execute(message: discord.Message):
    """Execute hello command."""
    if message.guild:
        logger.info(
            f"Message from guild: {message.guild.name}",
            {'guildId': message.guild.id}
        )

    button = discord.ui.Button(
        label='Open Modal',
        style=discord.ButtonStyle.primary,
        custom_id='open_modal'
    )

    view = discord.ui.View()
    view.add_item(button)

    await message.reply('Click to open the modal', view=view)
