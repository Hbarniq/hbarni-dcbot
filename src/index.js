console.clear();
require("dotenv").config();
const { token } = process.env;
const { CommandClient, Collection } = require("eris");

const client = new CommandClient(token, {
    intents: ["guilds", "guildMembers", "guildPresences", "guildMessages"],
    allowedMentions: { everyone: false, users: true },
  },
  { defaultHelpCommand: false }
);

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.slashCommands = [];

require("./startup.js")(client);
client.startup();
// https://discord.com/api/oauth2/authorize?client_id=768875082705534977&permissions=8&scope=bot%20applications.commands