# discord-bot

This is a tiny Discord bot that replies to the command:

	!reverse <word-or-phrase>

and responds with:

	you're word spelled backwards is <reversed>

Setup 

1. Install dependencies:

```
npm install
```

2. Create a `.env` file in the project root with a DISCORD_TOKEN variable. (or set the `DISCORD_TOKEN` environment variable)

3. Run the bot:

```
npm start
```

Notes:
- The bot expects the Message Content Intent to be enabled for the bot in the Discord Developer Portal (required for reading message content). Enable "Message Content Intent" in your bot's settings.
- Keep your token secret. Do not commit a `.env` with a real token.