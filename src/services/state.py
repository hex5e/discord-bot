"""Bot state persistence module."""
import json
from pathlib import Path
from src.utils.logger import logger


STATE_FILE = Path(__file__).parent.parent.parent / '.bot_state.json'


async def load_state() -> dict:
    """Load state from file."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        logger.debug('State file does not exist, returning empty state')
        return {}
    except Exception as err:
        logger.error('Failed to load state file', {'error': str(err)})
        return {}


async def save_state(state: dict):
    """Save state to file."""
    try:
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f, indent=2)
        logger.debug('State file saved')
    except Exception as err:
        logger.error('Failed to save state file', {'error': str(err)})
        raise


async def get_state_value(key: str):
    """Get a single state value."""
    state = await load_state()
    return state.get(key)


async def set_state_value(key: str, value):
    """Set a single state value."""
    state = await load_state()
    state[key] = value
    await save_state(state)


async def delete_state_value(key: str):
    """Delete a single state value."""
    state = await load_state()
    if key in state:
        del state[key]
        await save_state(state)
