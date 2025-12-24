import logging
import os
import sys
from datetime import datetime

LOG_LEVELS = {
    "ERROR": logging.ERROR,
    "WARN": logging.WARNING,
    "INFO": logging.INFO,
    "DEBUG": logging.DEBUG,
}

def setup_logger():
    """Setup and configure the application logger."""
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    level = LOG_LEVELS.get(log_level, logging.INFO)

    # Create logger
    logger = logging.getLogger("discord_bot")
    logger.setLevel(level)

    # Create console handler with formatting
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S"
    )
    handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(handler)

    return logger

# Create default logger instance
logger = setup_logger()

__all__ = ["logger", "setup_logger"]
