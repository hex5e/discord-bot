"""Custom error classes."""


class BotError(Exception):
    """Base bot error class."""

    def __init__(self, message: str, code: str = 'BOT_ERROR'):
        super().__init__(message)
        self.code = code


class ConfigError(BotError):
    """Configuration error."""

    def __init__(self, message: str):
        super().__init__(message, 'CONFIG_ERROR')


class HandlerError(BotError):
    """Handler error."""

    def __init__(self, message: str):
        super().__init__(message, 'HANDLER_ERROR')


class ConnectionError(BotError):
    """Connection error."""

    def __init__(self, message: str):
        super().__init__(message, 'CONNECTION_ERROR')
