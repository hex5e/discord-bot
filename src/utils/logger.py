"""Logging utility module."""
import os
import json
from datetime import datetime
from enum import IntEnum


class LogLevel(IntEnum):
    """Log level enumeration."""
    ERROR = 0
    WARN = 1
    INFO = 2
    DEBUG = 3


class Logger:
    """Simple logger class."""

    def __init__(self):
        log_level_str = os.getenv('LOG_LEVEL', 'INFO').upper()
        self.current_level = getattr(LogLevel, log_level_str, LogLevel.INFO)

    def _format_message(self, level: str, message: str, meta: dict = None) -> str:
        """Format log message with timestamp and metadata."""
        timestamp = datetime.utcnow().isoformat() + 'Z'
        meta_str = f" {json.dumps(meta)}" if meta else ""
        return f"[{timestamp}] [{level}] {message}{meta_str}"

    def error(self, message: str, meta: dict = None):
        """Log error message."""
        if self.current_level >= LogLevel.ERROR:
            print(self._format_message('ERROR', message, meta))

    def warn(self, message: str, meta: dict = None):
        """Log warning message."""
        if self.current_level >= LogLevel.WARN:
            print(self._format_message('WARN', message, meta))

    def info(self, message: str, meta: dict = None):
        """Log info message."""
        if self.current_level >= LogLevel.INFO:
            print(self._format_message('INFO', message, meta))

    def debug(self, message: str, meta: dict = None):
        """Log debug message."""
        if self.current_level >= LogLevel.DEBUG:
            print(self._format_message('DEBUG', message, meta))


# Global logger instance
logger = Logger()
