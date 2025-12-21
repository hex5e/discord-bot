# Discord Bot

A Discord bot with a modular architecture.

## Project Structure

```
discord-bot/
├── src/
│   ├── index.js                 # Entry point, starts the bot
│   ├── bot.js                   # Main bot class/logic
│   ├── events/
│   │   ├── index.js             # Event registry
│   │   ├── ready.js             # Bot ready event
│   │   ├── messageCreate.js     # Message event (routes to commands)
│   │   └── interactionCreate.js # Button/modal interactions
│   ├── commands/
│   │   ├── index.js             # Command registry
│   │   └── hello.js             # !hello command
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

### Prefix Commands

- **!hello** - Sends a button that opens a modal
- **!ping** - Shows message and gateway latency

### Slash Commands

- **/get_numeric_ids** - Displays server ID and all channel IDs (ephemeral, useful for reference)

#### Deploying Slash Commands

Before slash commands work, you need to register them with Discord:

1. Add `CLIENT_ID` to your `.env` file (your bot's application ID)
2. Optionally add `GUILD_ID` for guild-specific deployment (faster, recommended for development)
3. Run the deployment script:

```bash
npm run deploy-commands
```

**Note:** Guild-specific commands update instantly. Global commands can take up to 1 hour to propagate.

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