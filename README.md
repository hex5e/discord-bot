# Discord Bot

A Discord bot with a modular architecture built with Python and discord.py.

## Project Structure

```
discord-bot/
├── src/
│   ├── main.py                  # Entry point, starts the bot
│   ├── bot.py                   # Main bot class/logic
│   ├── events/
│   │   ├── registry.py          # Event registry
│   │   ├── ready.py             # Bot ready event
│   │   ├── message_create.py    # Message event (routes to commands)
│   │   └── interaction_create.py # Button/modal interactions
│   ├── commands/
│   │   ├── registry.py          # Command registry
│   │   ├── ping.py              # !ping command
│   │   ├── crawl_local.py       # !crawl-local command
│   │   └── crawl_remote.py      # !crawl-remote command
│   ├── api/
│   │   ├── crawler_local.py     # Columbus jobs crawler
│   │   └── crawler_remote.py    # Remote jobs crawler
│   ├── services/
│   │   └── state.py             # Bot state persistence
│   └── utils/
│       ├── logger.py            # Logging utility
│       ├── config.py            # Configuration loading
│       ├── errors.py            # Custom error classes
│       ├── constants.py         # Application constants
│       └── job_parser.py        # Job data parser
├── config/
│   ├── default.json             # Default configuration
│   ├── production.json          # Production overrides
│   └── development.json         # Development overrides
├── .env.example                 # Environment variable template
├── .gitignore
├── requirements.txt             # Python dependencies
├── pyproject.toml              # Python project configuration
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
# Development mode (debug logging)
LOG_LEVEL=debug python -m src.main

# Production mode
NODE_ENV=production python -m src.main

# Default
python -m src.main
```

## Features

- **!ping** - Shows message and gateway latency
- **!crawl-local** - Crawls tech jobs in Columbus, OH
- **!crawl-remote** - Crawls remote tech jobs

## Commands

The bot integrates with jobspy to search for tech jobs from multiple sources (Indeed, LinkedIn, ZipRecruiter, Glassdoor).

## Configuration

Configuration files are located in the `config/` directory:

- `default.json` - Base configuration
- `development.json` - Development overrides
- `production.json` - Production overrides

Set `NODE_ENV` to control which environment config is loaded.

## Requirements

- Python 3.8 or higher
- discord.py v2.3.2
- python-dotenv v1.0.0
- python-jobspy v1.1.78
- Message Content Intent enabled in Discord Developer Portal