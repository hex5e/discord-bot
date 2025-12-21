# CLAUDE.md - Discord Bot Development Guide

This document provides comprehensive guidance for AI assistants working on this Discord bot codebase.

## Project Overview

**Name**: discord-bot-reverse
**Type**: Discord bot with interactive UI components (buttons, modals)
**Technology**: Node.js with discord.js v14
**Module System**: ES Modules (`type: "module"` in package.json)
**Primary Function**: Interactive bot that responds to commands and provides modal-based user interactions

## Codebase Structure

```
discord-bot/
├── index.js              # Main bot entry point (all bot logic)
├── package.json          # Dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── README.md             # User-facing documentation
├── .gitignore            # Git ignore rules
├── .env                  # Environment variables (not committed)
└── .bot_state.json       # Runtime state persistence (not committed)
```

### Key Files

#### `index.js` (Main Application)
The entire bot logic is contained in a single file with the following structure:

1. **Imports** (lines 1-14): Discord.js components and Node.js fs module
2. **Client Initialization** (lines 16-22): Discord client with required intents
3. **Ready Event Handler** (lines 25-86): Startup logic and one-time message setup
4. **Message Handler** (lines 88-106): Command processing (`!hello`)
5. **Interaction Handler** (lines 109-156): Button clicks and modal submissions
6. **Login** (line 158): Bot authentication

#### Environment Variables
- `DISCORD_TOKEN` (required): Bot authentication token from Discord Developer Portal
- `DEV_GUILD_ID` (optional): Target guild ID for one-time startup message

#### State Persistence
- `.bot_state.json`: Tracks which guilds have received the one-time startup message
- Format: `{ "guildId": { "createdAt": "ISO-8601 timestamp" } }`

## Discord.js Architecture

### Intents Configuration
The bot requires these Gateway Intents (index.js:17-21):
```javascript
GatewayIntentBits.Guilds          // Access to guild information
GatewayIntentBits.GuildMessages   // Receive message events
GatewayIntentBits.MessageContent  // Read message content (privileged)
```

**Important**: `MessageContent` is a privileged intent and must be enabled in the Discord Developer Portal under "Bot > Privileged Gateway Intents".

### Event Handlers

#### 1. Ready Event (`client.once('ready', ...)`)
- Fires once when bot successfully connects
- Logs connected guilds
- Executes one-time setup (sends button message to target guild)
- Uses state file to prevent duplicate messages

#### 2. Message Create Event (`client.on('messageCreate', ...)`)
- Fires for every message in guilds where the bot is present
- **Command**: `!hello` → replies with a button to open a modal
- Ignores bot messages to prevent loops

#### 3. Interaction Create Event (`client.on('interactionCreate', ...)`)
Handles three interaction types:
- **Button `open_modal`**: Shows modal dialog with text input
- **Modal Submit `hello_modal`**: Replies with submitted text and dismiss button
- **Button `dismiss_message`**: Deletes the message containing the button

### UI Components

#### Buttons
```javascript
ButtonBuilder()
  .setCustomId('unique_id')    // Identifier for interaction handling
  .setLabel('Display Text')
  .setStyle(ButtonStyle.Primary | Secondary | Success | Danger)
```

#### Modals
```javascript
ModalBuilder()
  .setCustomId('unique_id')
  .setTitle('Modal Title')
```

#### Text Inputs
```javascript
TextInputBuilder()
  .setCustomId('field_id')
  .setLabel('Field Label')
  .setStyle(TextInputStyle.Short | Paragraph)
  .setValue('default value')
  .setRequired(true | false)
```

#### Action Rows
Components must be wrapped in `ActionRowBuilder`:
```javascript
new ActionRowBuilder().addComponents(button1, button2, ...)
```

## Development Workflows

### Setup
1. Clone repository
2. Run `npm install` to install dependencies
3. Create `.env` file with `DISCORD_TOKEN=your_token_here`
4. Optionally set `DEV_GUILD_ID=guild_id` for testing
5. Run `npm start` to launch bot

### Running the Bot
```bash
npm start  # Runs: node index.js
```

### Git Workflow
- **Development Branch Pattern**: `claude/claude-md-[session-id]`
- **Main Branch**: Not explicitly defined in current repo state
- **Current Branch**: `claude/claude-md-mjg4t01dn7za0nnt-MPiQF`

#### Git Push Requirements
- Always use: `git push -u origin <branch-name>`
- Branch must start with `claude/` and end with matching session ID
- Retry logic: Up to 4 retries with exponential backoff (2s, 4s, 8s, 16s) for network failures

### Testing
- **Manual Testing**: Run bot locally and test in a Discord server
- **Required Setup**: Create a test Discord server and invite the bot
- **Bot Permissions**: Ensure "Message Content Intent" is enabled in Developer Portal

## Code Conventions

### Code Style
- **ES Modules**: Use `import`/`export`, not `require()`
- **Arrow Functions**: Preferred for callbacks and event handlers
- **Async/Await**: Used for asynchronous operations (no `.then()` chains)
- **Optional Chaining**: Used for safe property access (`client.user?.tag`)
- **Nullish Coalescing**: Used for defaults (`?? 'fallback'`)

### Error Handling
- Try-catch blocks for file I/O operations (index.js:38-43, 82-84)
- Try-catch for interaction operations (index.js:148-154)
- Graceful degradation (skip operations if they fail)
- Console.error for logging errors

### Naming Conventions
- **Variables**: camelCase (`targetGuildId`, `stateFile`)
- **Constants**: camelCase (no SCREAMING_SNAKE_CASE)
- **Custom IDs**: snake_case (`open_modal`, `hello_modal`, `dismiss_message`)
- **Functions**: camelCase (event handlers are inline arrow functions)

### Message Handling Patterns
1. **Check bot messages**: `if (message.author.bot) return;`
2. **Command prefix**: Use `!` for text commands
3. **Early returns**: Exit handlers early for non-matching cases
4. **Reply vs Send**:
   - `message.reply()` - Reply to user message
   - `channel.send()` - Send standalone message

### Interaction Handling Patterns
1. **Type guards**: Check interaction type before accessing type-specific properties
2. **Ephemeral responses**: Use `{ ephemeral: true }` for private acknowledgments
3. **Defer when needed**: For operations taking >3 seconds, defer the interaction
4. **Custom ID routing**: Use unique custom IDs to route interactions to correct handlers

## Common Tasks

### Adding a New Command
1. Add handler in `messageCreate` event
2. Check for command prefix and command name
3. Implement command logic
4. Use `message.reply()` to respond

Example:
```javascript
if (message.content.startsWith('!mycommand')) {
  // Command logic here
  message.reply('Response');
  return;
}
```

### Adding a New Button
1. Create `ButtonBuilder` with unique `customId`
2. Add to `ActionRowBuilder`
3. Include in message components
4. Handle in `interactionCreate` event with matching `customId`

### Adding a New Modal
1. Create `ModalBuilder` with unique `customId`
2. Add `TextInputBuilder` components in `ActionRowBuilder`
3. Show modal in response to button/command: `interaction.showModal(modal)`
4. Handle submission in `interactionCreate` with `isModalSubmit()` check

### Persisting State
Pattern used for `.bot_state.json`:
```javascript
// Read
let state = {};
try {
  const raw = await fs.readFile(stateFile, 'utf8');
  state = JSON.parse(raw);
} catch (e) {
  // File doesn't exist - use empty state
}

// Modify
state[key] = value;

// Write
await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf8');
```

### Finding a Suitable Channel
Pattern from index.js:56-66:
1. Check `guild.systemChannel` first
2. Fall back to first text channel with send permissions
3. Handle case where no suitable channel exists

## Discord API Concepts

### Guilds
- Discord servers are called "guilds" in the API
- Access via `client.guilds.cache`
- Each guild has channels, members, roles, etc.

### Channels
- Types: `ChannelType.GuildText`, `GuildVoice`, `GuildAnnouncement`, etc.
- Check permissions: `channel.permissionsFor(user)?.has(PermissionFlagsBits.SendMessages)`

### Interactions
All UI component interactions (buttons, modals, select menus) use the interaction system:
- Must respond within 3 seconds
- Use `interaction.reply()`, `interaction.deferReply()`, or `interaction.showModal()`
- Can be ephemeral (visible only to user) or public

### Components
- Maximum 5 `ActionRow` per message
- Maximum 5 buttons per `ActionRow`
- Maximum 1 select menu per `ActionRow`
- Modals can have up to 5 `ActionRow` with text inputs

## Security & Best Practices

### Secrets Management
- **Never commit** `.env` files
- Store `DISCORD_TOKEN` in environment variables
- Rotate tokens if accidentally exposed
- Use `.gitignore` to exclude sensitive files

### Permission Checks
- Always verify bot has required permissions before operations
- Check channel permissions before sending messages
- Handle permission errors gracefully

### Rate Limiting
- Discord.js handles rate limiting automatically
- Avoid sending excessive messages in loops
- Use bulk operations when available

### Input Validation
- Validate user input from modals before processing
- Sanitize input if used in embeds or other formatted content
- Set reasonable length limits on text inputs

## Dependencies

### Production Dependencies
- `discord.js: ^14.11.0` - Discord API wrapper
- `dotenv: ^16.3.1` - Environment variable loader

### Discord.js v14 Breaking Changes
If upgrading from v13:
- `MessageButton` → `ButtonBuilder`
- `MessageActionRow` → `ActionRowBuilder`
- Intents are now required and more granular
- Component builders use method chaining exclusively

## Deployment Considerations

### Environment
- Node.js version: Use LTS version (16.x or higher for discord.js v14)
- Process management: Consider using PM2 or similar for production
- Logging: Current setup uses console.log (consider structured logging for production)

### Hosting
- Requires persistent process (not serverless)
- Needs outbound websocket connection to Discord gateway
- Consider: Heroku, DigitalOcean, Railway, fly.io, or VPS

### Monitoring
- Bot status: Check `client.user` in ready event
- Guild count: `client.guilds.cache.size`
- Uptime tracking: Add timestamp in ready event
- Error logging: Currently logs to console

## Troubleshooting

### Common Issues

**Bot doesn't respond to messages**
- Verify `MessageContent` intent is enabled in Developer Portal
- Check bot has `VIEW_CHANNEL` and `SEND_MESSAGES` permissions
- Ensure `GatewayIntentBits.MessageContent` is in client initialization

**"Interaction failed" error**
- Must respond to interactions within 3 seconds
- Use `interaction.deferReply()` for slow operations
- Check for try-catch blocks around interaction responses

**One-time message sends repeatedly**
- Check `.bot_state.json` file exists and is writable
- Verify file permissions
- Check guild ID matches between env and state file

**Modal doesn't appear**
- Verify modal is shown in response to button interaction
- Check custom IDs match between button and handler
- Ensure modal has at least one text input component

## AI Assistant Guidelines

### When Modifying Code
1. **Read first**: Always read `index.js` before making changes
2. **Maintain patterns**: Follow existing code style and patterns
3. **Test interactions**: Remember 3-second interaction timeout
4. **Update docs**: Update README.md if user-facing behavior changes
5. **No over-engineering**: Keep it simple - this is a small bot

### When Adding Features
1. Consider if state persistence is needed
2. Add appropriate error handling
3. Log important events to console
4. Use existing UI component patterns
5. Verify Discord API limits and constraints

### When Debugging
1. Check console output for errors
2. Verify environment variables are set
3. Check Discord Developer Portal for bot status
4. Validate custom IDs match between components and handlers
5. Review Discord.js v14 documentation for API changes

### Before Committing
1. Test the bot locally
2. Verify no secrets in committed files
3. Update README.md if setup process changed
4. Follow git branch naming conventions
5. Write clear commit messages describing the change

## Resources

### Documentation
- [Discord.js Guide](https://discordjs.guide/) - Official guide
- [Discord.js Docs](https://discord.js.org/) - API reference
- [Discord Developer Portal](https://discord.com/developers/applications) - Bot management
- [Discord API Docs](https://discord.com/developers/docs/intro) - Official API docs

### Code Patterns in This Repo
- **One-time setup**: index.js:31-85 (state-based execution guard)
- **Button creation**: index.js:69-74, 95-100, 134-137
- **Modal creation**: index.js:114-126
- **Interaction routing**: index.js:109-156 (type guards and custom ID matching)
- **Channel finding**: index.js:56-66 (fallback pattern)

## Version History

**Current State** (as of latest commit: f786944)
- Bot can create modals
- Button interactions open modals
- Modal submissions create dismissible messages
- One-time startup message with button

**Previous Iterations**
- Started as simple word reversal bot (`!reverse` command)
- Evolved to interactive UI-based bot with modals and buttons

---

*This document should be updated whenever significant architectural changes are made to the codebase.*
