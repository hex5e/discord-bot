"""Command registry."""
import discord
from src.commands import ping, crawl_local, crawl_remote

COMMANDS = [ping, crawl_local, crawl_remote]


async def handle_command(message: discord.Message, client: discord.Client):
    """Handle incoming message as a command."""
    for cmd in COMMANDS:
        if message.content.startswith(cmd.PREFIX):
            await cmd.execute(message, client)
            return
