class BotError(Exception):
    """Base exception class for bot errors."""

    def __init__(self, message, code="BOT_ERROR"):
        super().__init__(message)
        self.code = code

class ConfigError(BotError):
    """Exception raised for configuration errors."""

    def __init__(self, message):
        super().__init__(message, "CONFIG_ERROR")

class HandlerError(BotError):
    """Exception raised for handler errors."""

    def __init__(self, message):
        super().__init__(message, "HANDLER_ERROR")

class ConnectionError(BotError):
    """Exception raised for connection errors."""

    def __init__(self, message):
        super().__init__(message, "CONNECTION_ERROR")

__all__ = ["BotError", "ConfigError", "HandlerError", "ConnectionError"]
