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

class HelloModal(discord.ui.Modal, title="Hello Modal"):
    """Modal for hello command."""

    message_input = discord.ui.TextInput(
        label="Message",
        style=discord.TextStyle.short,
        default="hello!",
        required=True
    )

    async def on_submit(self, interaction: discord.Interaction):
        """Handle modal submission."""
        submitted = self.message_input.value

        dismiss_button = discord.ui.Button(
            style=discord.ButtonStyle.secondary,
            label="Dismiss",
            custom_id="dismiss_message"
        )

        view = discord.ui.View(timeout=None)
        view.add_item(dismiss_button)

        await interaction.response.send_message(content=submitted, view=view)

async def handle_open_modal_button(interaction):
    """Handle the open modal button interaction."""
    modal = HelloModal()
    await interaction.response.send_modal(modal)

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
