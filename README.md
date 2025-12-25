# Discord Bot

A Discord bot with a modular architecture built with Python.

## Project Structure

```
discord-bot/
├── src/
│   ├── __main__.py              # Entry point, starts the bot
│   ├── __init__.py              # Package initialization
│   ├── bot.py                   # Main bot class/logic
│   ├── events/
│   │   ├── __init__.py          # Event registry
│   │   ├── ready.py             # Bot ready event
│   │   ├── message_create.py    # Message event (routes to commands)
│   │   └── interaction_create.py # Button/modal interactions
│   ├── commands/
│   │   ├── __init__.py          # Command registry
│   │   ├── hello.py             # !hello command
│   │   └── ping.py              # !ping command
│   ├── services/
│   │   ├── __init__.py
│   │   └── state.py             # Bot state persistence
│   └── utils/
│       ├── __init__.py
│       ├── logger.py            # Logging utility
│       ├── config.py            # Configuration loading
│       └── errors.py            # Custom error classes
├── config/
│   ├── default.json             # Default configuration
│   ├── production.json          # Production overrides
│   └── development.json         # Development overrides
├── logs/                        # Log files (gitignored)
├── .env.example                 # Environment variable template
├── .gitignore
├── requirements.txt             # Python dependencies
└── README.md
```

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Edit `.env` and add your Discord bot token.

4. Run the bot:

```bash
# Using python -m
python -m src

# Or with environment variable
NODE_ENV=production python -m src
```

## Features

- **!hello** - Sends a button that opens a modal
- **!ping** - Shows message and gateway latency
- Click the button to open a modal dialog
- Submit the modal to display your message with a dismiss button

## Configuration

Configuration files are located in the `config/` directory:

- `default.json` - Base configuration
- `development.json` - Development overrides
- `production.json` - Production overrides

Set `NODE_ENV` to control which environment config is loaded.

## Requirements

- Python 3.8 or higher
- discord.py (Discord library)
- python-dotenv
- Message Content Intent enabled in Discord Developer Portal