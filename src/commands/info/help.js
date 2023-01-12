const { Colors } = require("../../extra/colors");
const guild = require("../../schemas/guild");
exports.id = "1048593160886030377";
exports.command = {
  name: "help", // the command name, max 32 characters
  description: "Gives a list of all commands", // the command description, max 100 characters
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  let commands = [];
  const guildProfile = guild.findOne({ guildId: interaction.channel.guild.id });
  await client.commands.forEach((c) => {
    commands.push({
      name: `</${c.command.name}:${c.id}>`,
      value: `<:reply:1048598919258587196>${c.command.description}`,
    });
  });
  interaction.createMessage({
    flags: 64,
    embeds: [{
      title: "A list of all commands:",
      description:
        "I will probably make this more detailed \nand look nicer and have tabs and all that stuff :)\nright now it dynamicly updates with each command",
      color: Colors.Neutral,
      fields: commands,
      footer: {
        text: `Hbarni bot - help`,
        iconURL: `${client.user.avatarURL("png", 128)}`,
      },
    }],
  });
};
