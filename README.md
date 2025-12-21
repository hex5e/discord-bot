# Discord Bot

A modular Discord bot built with discord.js featuring slash commands, event handling, and a clean project structure.

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
│   │   ├── ping.js              # Ping command
│   │   ├── help.js              # Help command
│   │   └── moderation/
│   │       ├── ban.js           # Ban command
│   │       └── kick.js          # Kick command
│   ├── services/
│   │   ├── database.js          # Database operations
│   │   └── api.js               # External API calls
│   └── utils/
│       ├── logger.js            # Logging utility
│       ├── config.js            # Configuration loader
│       └── helpers.js           # Utility functions
├── config/
│   ├── default.json             # Default configuration
│   └── production.json          # Production overrides
├── logs/                        # Log files
├── .env.example                 # Environment template
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

3. Fill in your Discord credentials in `.env`:
   - `DISCORD_TOKEN` - Your bot token from the Discord Developer Portal
   - `CLIENT_ID` - Your application's client ID
   - `DEV_GUILD_ID` - (Optional) Guild ID for faster slash command updates during development

4. Run the bot:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Commands

### Slash Commands
- `/ping` - Check bot latency
- `/help` - Show available commands
- `/ban <user> [reason]` - Ban a user (requires Ban Members permission)
- `/kick <user> [reason]` - Kick a user (requires Kick Members permission)

### Prefix Commands
- `!hello` - Opens a modal via button interaction

## Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- A Discord bot token with the following intents enabled:
  - Guilds
  - Guild Messages
  - Message Content
  - Guild Members (for welcome messages)

## Configuration

Edit the JSON files in the `config/` directory to customize bot behavior:

- `default.json` - Default settings for all environments
- `production.json` - Production-specific overrides

## Adding New Commands

1. Create a new file in `src/commands/` (or a subdirectory for categories)
2. Export `data` (SlashCommandBuilder) and `execute` function
3. Restart the bot - commands are loaded automatically

Example:

```javascript
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Says hello');

export async function execute(interaction) {
  await interaction.reply('Hello!');
}
```

## Adding New Events

1. Create a new file in `src/events/`
2. Export `name`, `once` (boolean), and `execute` function
3. Restart the bot - events are loaded automatically

## License

MIT