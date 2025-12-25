"""Configuration loading module."""
import os
import json
from pathlib import Path


CONFIG_DIR = Path(__file__).parent.parent.parent / 'config'
_config = None


async def load_config() -> dict:
    """Load configuration from JSON files."""
    global _config
    if _config is not None:
        return _config

    env = os.getenv('NODE_ENV', 'development')

    # Load default config
    default_path = CONFIG_DIR / 'default.json'
    default_config = {}
    if default_path.exists():
        with open(default_path, 'r') as f:
            default_config = json.load(f)

    # Load environment-specific config
    env_path = CONFIG_DIR / f'{env}.json'
    env_config = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            env_config = json.load(f)

    # Merge configs (env overrides default)
    _config = {**default_config, **env_config}

    return _config


def get_config() -> dict:
    """Get loaded configuration."""
    if _config is None:
        raise RuntimeError('Config not loaded. Call load_config() first.')
    return _config
