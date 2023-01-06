const fs = require("fs");
module.exports = (client) => {
  client.handleCommands = async () => {
    console.log("----- Commands: -----")
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, slashCommands } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.command.name, command);
        slashCommands.push(command.command);
        console.log(`${command.command.name} registered`);
      }
    }

    const guildId = "652150784879886367";
    if (process.env.release == "true") {
      //globally sets (/) commands
      await client.bulkEditCommands(client.slashCommands).catch((e) => {
        throw new Error(e);
      });
      console.log("Successfully refreshed (/) commands");
    } else {
      //locally sets (/) commands results in duplicates on test server
      await client
        .bulkEditGuildCommands(guildId, client.slashCommands)
        .catch((e) => {
          throw new Error(e);
        });
      console.log("Successfully refreshed (/) commands Locally");
      if (process.env.globaldisable == "true") {
        await client.bulkEditCommands([]).catch((e) => {
          throw new Error(e);
        });
        console.log("commands are disabled globally");
      }
    }
  };
};
