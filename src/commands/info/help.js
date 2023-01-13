const { Colors } = require("../../extra/colors");

exports.command = {
  name: "help", // the command name, max 32 characters
  description: "Gives a list of all commands", // the command description, max 100 characters
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  let commands = [];
  const fetchedCommands =
    await client.rest.applicationCommands.getGlobalCommands(client.user.id);
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
