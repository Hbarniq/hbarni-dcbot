console.clear();
require("dotenv").config();
const { token } = process.env;
const { Client, Collection } = require("oceanic.js")

const client = new Client({
  auth: token,
  allowedMentions: { everyone: false, users: true},
  gateway: {
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
  }
})

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.slashCommands = [];

require("./startup.js")(client);
client.startup();