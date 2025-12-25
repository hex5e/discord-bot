"""Command registry."""
import discord
from src.commands import ping, crawl_local, crawl_remote


# List of all command modules
COMMANDS = [ping, crawl_local, crawl_remote]


async def handle_command(message: discord.Message):
    """Handle incoming message as a command."""
    for command in COMMANDS:
        if message.content.startswith(command.PREFIX):
            await command.execute(message)
            return
