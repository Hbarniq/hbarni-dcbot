const { Colors } = require("../../extra/colors");
const { error } = require("../../extra/replyFunc");

exports.command = {
  name: "help", // the command name, max 32 characters
  description: "Gives a list of all commands", // the command description, max 100 characters
  options: [{
    type: 3,
    name: "command",
    description: "gives more information about a specific command"
  }],
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  let commands = [];
  const fetchedCommands = await client.rest.applicationCommands.getGlobalCommands(client.user.id);
  const chosenC = await interaction.data.options.getString("command")

  if (chosenC) {
    const command = await fetchedCommands.find((c) => c.name == chosenC)
    if (!command) {
      return error("Command not found.. make sure you type its name correctly")
    }

    let options = [];
    optionTypes = ["sub command", "sub command group", "text", "number", "true/false", "server member", "channel", "role", "server member/role", "number", "attachment (file)"]
    if (command.options) {
      await command.options.forEach((o) => {
        options.push(`
        **${o.name}:**
        description: ${o.description}
        required: ${!o.required ? false : o.required}
        type: ${optionTypes[o.type -1]}`)
      })
    }

    return interaction.createMessage({
      flags: 64,
      embeds: [{
        title: `command: ${command.name}`,
        description: `
        > **info:** ${command.description}
        > **permission needed:** ${command.defaultMemberPermissions ? `${JSON.stringify(command.defaultMemberPermissions.json).replace('{"', "").replace('":true}', "").toLowerCase()}`
        : "none"}
        > **options:** ${options.length != 0 ? options.toString().replace(",", "") : "No options"}
        `,
        color: Colors.Neutral
      }]
    });
  };

  await fetchedCommands.forEach((c) => {
    commands.push({
      name: `</${c.name}:${c.id}> ${c.options ? `options: ${c.options.length}` : "(no options)"}`,
      value: `${c.description}${
        c.defaultMemberPermissions
          ? `\npermission: ${JSON.stringify(c.defaultMemberPermissions.json)
              .replace('{"', "")
              .replace('":true}', "")
              .toLowerCase()}`
          : "\npermission: none"
      }`,
    });
  });
  interaction.createMessage({
    flags: 64,
    embeds: [
      {
        title: "A list of all commands:",
        description: `There are currently a total of ${fetchedCommands.length} commands\nthis bot is open source! you can report issues [here](https://github.com/Hbarniq/Hbarni-dcbot) :)`,
        color: Colors.Neutral,
        fields: commands,
        footer: {
          text: `Hbarni bot - help`,
          iconURL: `${client.user.avatarURL("png", 128)}`,
        },
      },
    ],
  });
};
