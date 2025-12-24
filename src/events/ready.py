import os
import discord
from datetime import datetime
from ..utils.logger import logger
from ..services.state import load_state, save_state

name = "ready"
once = True

async def execute(client):
    """Execute when the bot is ready."""
    logger.info(f"Logged in as {client.user.name if client.user else 'unknown user'}")

    # Log guilds the bot is in
    for guild in client.guilds:
        logger.info(f"Guild: {guild.name}", extra={"guild_id": guild.id})

    # Attempt to send a one-time button message into the target guild
    await send_one_time_button_message(client)

async def send_one_time_button_message(client):
    """Send a one-time button message to the dev guild if configured."""
    target_guild_id = os.getenv("DEV_GUILD_ID")
    if not target_guild_id:
        logger.debug("No DEV_GUILD_ID set, skipping one-time message")
        return

    state = load_state()

    if target_guild_id in state:
        logger.info(f"One-time button already created for guild {target_guild_id}, skipping.")
        return

    guild = client.get_guild(int(target_guild_id))
    if not guild:
        logger.info(f"Bot is not a member of guild {target_guild_id} — skipping one-time message.")
        return

    # Find a suitable text channel where the bot can send messages
    channel = guild.system_channel
    if not channel:
        for ch in guild.text_channels:
            if ch.permissions_for(guild.me).send_messages:
                channel = ch
                break

    if not channel:
        logger.info(f"No channel found in guild {target_guild_id} where bot can send messages.")
        return

    try:
        button = discord.ui.Button(
            style=discord.ButtonStyle.primary,
            label="Open Modal",
            custom_id="open_modal"
        )

        view = discord.ui.View(timeout=None)
        view.add_item(button)

        await channel.send(
            content="A one-time message with a button (click to open modal)",
            view=view
        )

        # Persist that we've sent this message so we don't send it again
        state[target_guild_id] = {"created_at": datetime.utcnow().isoformat()}
        save_state(state)
        logger.info(f"One-time button message sent and recorded for guild {target_guild_id}")
    except Exception as err:
        logger.error(f"Failed to send one-time message to guild {target_guild_id}: {err}")

__all__ = ["name", "once", "execute"]
