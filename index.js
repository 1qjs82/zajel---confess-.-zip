require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')).forEach(file => {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.data) client.commands.set(cmd.data.name, cmd);
  });
}

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  fs.readdirSync(eventsPath).filter(f => f.endsWith('.js')).forEach(file => {
    const evt = require(path.join(eventsPath, file));
    if (evt.once) client.once(evt.name, (...a) => evt.execute(...a, client));
    else client.on(evt.name, (...a) => evt.execute(...a, client));
  });
}

client.login(process.env.DISCORD_TOKEN);
