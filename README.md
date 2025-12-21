# Discord Bot

A Discord bot with a modular architecture.

## Project Structure

```
discord-bot/
├── src/
│   ├── index.js                 # Entry point, starts the bot
│   ├── bot.js                   # Main bot class/logic
│   ├── handlers/
│   │   ├── index.js             # Event handler registry
│   │   ├── messageHandler.js    # Handle message events
│   │   ├── interactionHandler.js # Handle button/modal interactions
│   │   └── readyHandler.js      # Handle ready event
│   ├── services/
│   │   └── state.js             # Bot state persistence
│   └── utils/
│       ├── logger.js            # Logging utility
│       ├── config.js            # Configuration loading
│       └── errors.js            # Custom error classes
├── config/
│   ├── default.json             # Default configuration
│   ├── production.json          # Production overrides
│   └── development.json         # Development overrides
├── logs/                        # Log files (gitignored)
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Edit `.env` and add your Discord bot token.

4. Run the bot:

```bash
# Development mode (debug logging)
npm run dev

# Production mode
npm run prod

# Default
npm start
```

## Features

- **!hello** - Sends a button that opens a modal
- Click the button to open a modal dialog
- Submit the modal to display your message with a dismiss button

## Configuration

Configuration files are located in the `config/` directory:

- `default.json` - Base configuration
- `development.json` - Development overrides
- `production.json` - Production overrides

Set `NODE_ENV` to control which environment config is loaded.

## Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- Message Content Intent enabled in Discord Developer Portal