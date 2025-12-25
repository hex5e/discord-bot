"""Ping command handler."""
import discord

PREFIX = '!ping'


async def execute(message: discord.Message, client: discord.Client):
    """Execute ping command."""
    sent = await message.reply('Pinging...')
    message_latency = (sent.created_at - message.created_at).total_seconds() * 1000
    gateway_latency = client.latency * 1000
    await sent.edit(
        content=f'Pong!\n'
                f'Message latency: {message_latency:.0f}ms\n'
                f'Gateway latency: {gateway_latency:.0f}ms'
    )
