import time
import discord

name = "ping"
prefix = "!ping"

async def execute(message):
    """Execute the ping command to show latency."""
    sent = await message.reply("Pinging...")

    # Calculate message latency
    message_latency = (sent.created_at - message.created_at).total_seconds() * 1000

    # Get gateway latency
    gateway_latency = message.client.latency * 1000

    await sent.edit(
        content=f"🏓 Pong!\nMessage latency: {message_latency:.0f}ms\nGateway latency: {gateway_latency:.0f}ms"
    )

__all__ = ["name", "prefix", "execute"]
