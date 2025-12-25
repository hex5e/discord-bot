"""Command registry."""
import discord
from src.commands import ping

COMMANDS = [ping]


async def handle_command(message: discord.Message, client: discord.Client):
    """Handle incoming message as a command."""
    for cmd in COMMANDS:
        if message.content.startswith(cmd.PREFIX):
            await cmd.execute(message, client)
            return
