# Discord Bot (modular)

A modular Discord bot structured for clarity and extensibility. It greets users with a modal button, responds to `!hello`, and can send a one-time onboarding prompt in a development guild.

## Project structure

```
my-bot/
├── src/
│   ├── index.js                 # Entry point, starts the bot
│   ├── bot.js                   # Main bot class/logic
│   ├── websocket/
│   │   ├── client.js            # WebSocket connection management
│   │   ├── reconnect.js         # Reconnection logic
│   │   └── heartbeat.js         # Keep-alive/ping-pong handling
│   ├── handlers/
│   │   ├── index.js             # Event handler registry
│   │   ├── messageHandler.js    # Handle message events
│   │   └── statusHandler.js     # Handle ready/status events
│   ├── actions/
│   │   ├── sendMessage.js       # Message sending + modal helpers
│   │   └── updateStatus.js      # Presence updates
│   ├── services/
│   │   ├── api.js               # External API calls (placeholder)
│   │   └── database.js          # Simple persisted state store
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

2. Copy `.env.example` to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```

3. (Optional) Adjust configuration in `config/default.json` or environment-specific overrides (e.g., `config/development.json`).

4. Run the bot:
   ```bash
   npm start
   ```

## Configuration

Configuration is loaded from `config/default.json`, merged with `config/<NODE_ENV>.json`, and finally overridden by environment variables.

Key settings:
- `DISCORD_TOKEN` (env or `bot.token`): Bot token.
- `DEV_GUILD_ID` (env or `bot.devGuildId`): Guild to receive the one-time onboarding button.
- `bot.presence`: Presence payload passed to `client.user.setPresence`.
- `logging.level`: One of `error`, `warn`, `info`, `debug`.
- `storage.stateFile`: Filename for persisted state (tracks one-time message).
- `websocket.heartbeatIntervalMs`: Heartbeat logging interval.

## Features
- Responds to `!hello` with a button that opens a modal.
- Modal submissions are echoed back with a dismiss button.
- Sends a one-time onboarding message to the development guild (if configured).
- Basic reconnect/heartbeat logging hooks for Discord gateway stability.
