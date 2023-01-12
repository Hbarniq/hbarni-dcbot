const { Colors } = require("../../extra/colors");

exports.id = "1048593160886030385";
exports.command = {
  name: "ping", // the command name, max 32 characters
  description: "Pong!", // the command description, max 100 characters
  // options: [], // options you can provide (Array<Object>): https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
  type: 1, // 1 for slash command, 2 for user, and 3 for message
  defaultPermission: true, // whether the command is enabled by default when the app is added to a guild
  //defaultMemberPermissions: 0x8 - permissions => https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
};
exports.run = async (client, interaction) => {
  const msg = Date.now();
  await interaction.createMessage({
    embeds: [{
      fields: [
        {
          name: "Pong! 🏓",
          value: `getting ping...`,
        },
      ],
      color: Colors.Neutral, //Blurple
    }],
  });

  interaction.editOriginal({
    embeds: [{
      fields: [
        {
          name: "Pong! 🏓",
          value: `Ping is: ${Date.now() - msg - 200} ms`,
        },
      ],
      color: Colors.Neutral,
    }],
  });
};
