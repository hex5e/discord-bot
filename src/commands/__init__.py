from . import hello
from . import ping

commands = [hello, ping]

async def handle_command(message):
    """Handle incoming message and execute matching command."""
    for command in commands:
        if message.content.startswith(command.prefix):
            await command.execute(message)
            return True
    return False

__all__ = ["handle_command", "commands"]
