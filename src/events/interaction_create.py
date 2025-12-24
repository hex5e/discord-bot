import discord
from ..utils.logger import logger

name = "interaction"
once = False

async def execute(interaction):
    """Execute when an interaction is created."""
    # Handle button interactions
    if isinstance(interaction, discord.Interaction):
        if interaction.type == discord.InteractionType.component:
            # Button: open the modal
            if interaction.data.get("custom_id") == "open_modal":
                await handle_open_modal_button(interaction)
                return

            # Dismiss button: delete the message
            if interaction.data.get("custom_id") == "dismiss_message":
                await handle_dismiss_button(interaction)
                return

        # Modal submit: reply with the submitted text and a dismiss button
        elif interaction.type == discord.InteractionType.modal_submit:
            if interaction.data.get("custom_id") == "hello_modal":
                await handle_modal_submit(interaction)
                return

async def handle_open_modal_button(interaction):
    """Handle the open modal button interaction."""
    modal = discord.ui.Modal(title="Hello Modal", custom_id="hello_modal")

    text_input = discord.ui.TextInput(
        label="Message",
        custom_id="modal_input",
        style=discord.TextStyle.short,
        default="hello!",
        required=True
    )

    modal.add_item(text_input)

    await interaction.response.send_modal(modal)

async def handle_modal_submit(interaction):
    """Handle the modal submission."""
    submitted = interaction.data["components"][0]["components"][0]["value"]

    dismiss_button = discord.ui.Button(
        style=discord.ButtonStyle.secondary,
        label="Dismiss",
        custom_id="dismiss_message"
    )

    view = discord.ui.View(timeout=None)
    view.add_item(dismiss_button)

    await interaction.response.send_message(content=submitted, view=view)

async def handle_dismiss_button(interaction):
    """Handle the dismiss button interaction."""
    try:
        if interaction.message:
            await interaction.message.delete()
        await interaction.response.send_message(content="Message dismissed.", ephemeral=True)
    except Exception as err:
        logger.error(f"Failed to dismiss message: {err}")
        await interaction.response.send_message(content="Couldn't delete message.", ephemeral=True)

__all__ = ["name", "once", "execute"]
