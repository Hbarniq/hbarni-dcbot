console.clear();
require("dotenv").config();
const { token, dbToken } = process.env;
const { CommandClient, Collection } = require('eris')
const { connect, set } = require('mongoose')
const fs = require("fs");

const client = new CommandClient(token ,{
  intents: ["guilds", "guildMembers", "guildPresences"],
  allowedMentions: {everyone: false, users: true},
}, {
  defaultHelpCommand: false
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.slashCommands = [];

const functionfolders = fs.readdirSync(`./src/functions`);
for (const folder of functionfolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((files) => files.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.connect();
(async () => { //database connection
  set("strictQuery", true)
  await connect(dbToken, { dbName: "data" }).catch(console.error) 
})();
// https://discord.com/api/oauth2/authorize?client_id=768875082705534977&permissions=8&scope=bot%20applications.commands