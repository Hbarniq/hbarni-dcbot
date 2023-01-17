const { Colors } = require("../../extra/colors");


exports.command = {
  name: "serverinfo", // the command name, max 32 characters
  description: "returns info about the current server", // the command description, max 100 characters
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  const guild = interaction.channel.guild;
  let icon;

  let setTimestamp = guild.createdAt / 1000;
  setTimestamp = Math.floor(setTimestamp);

  if (guild.icon) {
    icon = guild.iconURL(
      guild.icon.startsWith("a_") ? "gif" : "png",
      128
    );
  } else icon = "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico";

  interaction.createMessage({
    embeds: [{
      author: { name: `${guild.name}`, iconURL: `${icon}` },
      color: Colors.Neutral,
      fields: [
        { name: "Server id", value: `:tools: ${guild.id}`, inline: true },
        { name: "Owner", value: `<@${guild.ownerID}>`, inline: true },
        {
          name: "Members",
          value: `:busts_in_silhouette: ${guild.memberCount}`,
        },
        {
          name: "Total channels",
          value: `:page_facing_up: ${guild.channels.size}`,
        },
        {
          name: "Roles",
          value: `:scroll: ${guild.roles.size}`,
          inline: true,
        },
        {
          name: "Emojis",
          value: `:upside_down: ${guild.emojis.length}`,
          inline: true,
        },
        {
          name: "Creation date",
          value: `<t:${setTimestamp}>  \`<=>\`  <t:${setTimestamp}:R>`,
        },
      ],
    }],
  });
};
