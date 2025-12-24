import json
from pathlib import Path
from ..utils.logger import logger

STATE_FILE = Path(__file__).parent.parent.parent / ".bot_state.json"

def load_state():
    """Load the bot state from the state file."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        else:
            logger.debug("State file does not exist, returning empty state")
            return {}
    except Exception as err:
        logger.error(f"Failed to load state file: {err}")
        return {}

def save_state(state):
    """Save the bot state to the state file."""
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)
        logger.debug("State file saved")
    except Exception as err:
        logger.error(f"Failed to save state file: {err}")
        raise

def get_state_value(key):
    """Get a specific value from the state."""
    state = load_state()
    return state.get(key)

def set_state_value(key, value):
    """Set a specific value in the state."""
    state = load_state()
    state[key] = value
    save_state(state)

def delete_state_value(key):
    """Delete a specific value from the state."""
    state = load_state()
    if key in state:
        del state[key]
        save_state(state)

__all__ = [
    "load_state",
    "save_state",
    "get_state_value",
    "set_state_value",
    "delete_state_value",
]
