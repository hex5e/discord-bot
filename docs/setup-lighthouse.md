# Complete Lightsail Setup Guide

## Step 1: Create Lightsail Instance

1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click **"Create instance"**
3. Choose:
   - **Platform:** Linux/Unix
   - **Blueprint:** OS Only → Ubuntu 22.04 LTS
   - **Plan:** $3.50/month (512 MB RAM) - should be plenty for a Discord bot
4. Name it `discord-bot`
5. Click **"Create instance"**

## Step 2: Connect via SSH

```bash
# Download the SSH key from Lightsail console, then:
ssh -i LightsailDefaultKey-us-east-1.pem ubuntu@your-lightsail-ip

# Or use the browser-based SSH client (click "Connect using SSH" button)
```

## Step 3: Setup Your Bot

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and git
sudo apt install python3 python3-pip git -y

# Clone your repository
git clone https://github.com/hex5e/discord-bot.git
cd discord-bot

# Install dependencies
pip3 install -e .

# Create .env file
cp .env.example .env
nano .env
# Add your BOT_TOKEN and set NODE_ENV=production
```

Your `.env` should look like:

```env
BOT_TOKEN=your_actual_token_here
```

## Step 4: Keep Bot Running (Using systemd)

Create a systemd service so the bot auto-starts and restarts on failure:

```bash
sudo nano /etc/systemd/system/discord-bot.service
```

Add this content:

```ini
[Unit]
Description=Discord Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/discord-bot
EnvironmentFile=/home/ubuntu/discord-bot/.env
ExecStart=/home/ubuntu/discord-bot/.pyvenv/bin/python3
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable discord-bot
sudo systemctl start discord-bot
```

## Step 5: Manage Your Bot

```bash
# Check status
sudo systemctl status discord-bot

# View logs
sudo journalctl -u discord-bot -f

# Restart bot
sudo systemctl restart discord-bot

# Stop bot
sudo systemctl stop discord-bot
```

## Step 6: Update Your Bot Later

```bash
cd ~/discord-bot
git pull
sudo systemctl restart discord-bot
```
