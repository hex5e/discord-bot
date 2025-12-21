# Discord Bot

A structured Discord bot project using `discord.js` v14.

## Features
- Slash commands with dynamic registration (`/ping`, `/help`, `/ban`, `/kick`).
- Message commands via prefix (default `!`): `!reverse <text>` and `!hello`.
- One-time message with modal button in a development guild.
- Welcome message when new members join.
- Configurable logging and environment-based settings.

## Project Structure
```
discord-bot/
├── src/
│   ├── index.js                 # Entry point, bot login
│   ├── bot.js                   # Client setup and event registration
│   ├── events/
│   │   ├── ready.js             # Bot ready event
│   │   ├── messageCreate.js     # Message events
│   │   ├── interactionCreate.js # Slash commands/buttons
│   │   └── guildMemberAdd.js    # Welcome new members
│   ├── commands/
│   │   ├── ping.js              # Slash command
│   │   ├── help.js
│   │   └── moderation/
│   │       ├── ban.js
│   │       └── kick.js
│   ├── services/
│   │   ├── database.js          # Database operations (placeholder)
│   │   └── api.js               # External API calls (placeholder)
│   └── utils/
│       ├── logger.js
│       ├── config.js
│       └── helpers.js           # Utility functions
├── config/
│   ├── default.json
│   └── production.json
├── logs/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root with the following variables (see `.env.example`):
   ```
   DISCORD_TOKEN=your-discord-bot-token
   CLIENT_ID=your-application-client-id
   DEV_GUILD_ID=your-development-guild-id
   ```
3. Run the bot:
   ```
   npm start
   ```

## Notes
- Ensure the Message Content Intent is enabled for your bot in the Discord Developer Portal.
- The one-time message feature uses `.bot_state.json` in the project root to track delivery.
- Do not commit real tokens or secrets; `.env` is ignored by git.
