import json
import os
from pathlib import Path

_config = None

def load_config():
    """Load configuration from JSON files based on environment."""
    global _config

    if _config is not None:
        return _config

    env = os.getenv("NODE_ENV", "development")
    config_dir = Path(__file__).parent.parent.parent / "config"

    # Load default config
    default_path = config_dir / "default.json"
    default_config = {}
    if default_path.exists():
        with open(default_path, "r") as f:
            default_config = json.load(f)

    # Load environment-specific config
    env_path = config_dir / f"{env}.json"
    env_config = {}
    if env_path.exists():
        with open(env_path, "r") as f:
            env_config = json.load(f)

    # Merge configs (env overrides default)
    _config = {**default_config, **env_config}

    return _config

def get_config():
    """Get the loaded configuration."""
    global _config

    if _config is None:
        raise RuntimeError("Config not loaded. Call load_config() first.")

    return _config

__all__ = ["load_config", "get_config"]
