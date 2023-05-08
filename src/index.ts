import { Client, Intents } from 'oceanic.js';

import startup from './util/startup.js';
import { getDotenv } from './util/util.js';

getDotenv()

const client = new Client({
  auth: process.env.DISCORD_BOT_TOKEN,
  gateway: {
    intents: [
      Intents.GUILDS,
      Intents.GUILD_MEMBERS,
      Intents.GUILD_MESSAGES,
      Intents.MESSAGE_CONTENT
    ],
  }
});

startup(client);