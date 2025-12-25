"""Interaction create event handler."""
import discord
from src.utils.logger import logger


class HelloModal(discord.ui.Modal, title='Hello Modal'):
    """Modal for hello command."""

    message_input = discord.ui.TextInput(
        label='Message',
        style=discord.TextStyle.short,
        default='hello!',
        required=True
    )

    async def on_submit(self, interaction: discord.Interaction):
        """Handle modal submission."""
        # Create dismiss button
        dismiss_button = discord.ui.Button(
            label='Dismiss',
            style=discord.ButtonStyle.secondary,
            custom_id='dismiss_message'
        )

        view = discord.ui.View(timeout=None)
        view.add_item(dismiss_button)

        await interaction.response.send_message(
            content=self.message_input.value,
            view=view
        )


async def execute(interaction: discord.Interaction):
    """Execute interaction create event."""
    # Handle button interactions
    if interaction.type == discord.InteractionType.component:
        if interaction.data and interaction.data.get('custom_id') == 'open_modal':
            await handle_open_modal_button(interaction)
        elif interaction.data and interaction.data.get('custom_id') == 'dismiss_message':
            await handle_dismiss_button(interaction)


async def handle_open_modal_button(interaction: discord.Interaction):
    """Handle open modal button click."""
    modal = HelloModal()
    await interaction.response.send_modal(modal)


async def handle_dismiss_button(interaction: discord.Interaction):
    """Handle dismiss button click."""
    try:
        if interaction.message:
            await interaction.message.delete()
        await interaction.response.send_message('Message dismissed.', ephemeral=True)
    except Exception as err:
        logger.error('Failed to dismiss message', {'error': str(err)})
        await interaction.response.send_message("Couldn't delete message.", ephemeral=True)
