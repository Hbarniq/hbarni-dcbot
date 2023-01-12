const util = require("minecraft-server-util");
const guild = require("../../schemas/guild");
const { error } = require("../../extra/replyFunc");
const { Colors } = require("../../extra/colors");

exports.id = "1048593160886030380";
exports.command = {
  name: "pingmc",
  description: "Pings the minecraft server and returns some info",
  options: [
    {
      type: 3,
      name: "change_ip",
      description: "only use this if you want to disable verification",
      required: false,
    },
  ],
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  await interaction.defer();

  let guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  const serverip = guildProfile.serverip;

  const ip = interaction.data.options.getString("change_ip");
  if (ip != undefined) {
    if (interaction.member.permissions.has("ADMINISTRATOR")) {
      // test if valid ip
      if (ip && !/^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(ip)) {
        return error('the ip you want to change to is not a valid ip adress\nif you are trying to specify ":25565" at the end you dont have to', interaction)
      } else if (ip) {
        guildProfile.serverip = ip;
        await guildProfile.save().catch();
        return await interaction.createFollowup({
        embeds: [{
          title: "settings updated!",
          description: `server ip has been changed to ||${ip}||`,
          color: Colors.Success,
        }],
      });
      }
    } else {
      return error(
        "you don't have permission to change the pinged server's ip only administrators do", interaction
      );
    }
  }

  if (!serverip) {
    return error(
      "you have not defined a server ip yet! \ntry the change ip option", interaction
    );
  }

  try {
    const response = await util.status(serverip, 25565, {
      timeout: 7500,
    });
    interaction.createFollowup({
      embeds: [{
        title: "Server status",
        description: "A server is online",
        color: Colors.Success,
        thumbnail: {
          url: "https://cdn.discordapp.com/avatars/419838142510530572/af980f65ee01db127c18dd4809742851.png?size=64",
        },
        fields: [
          { name: "Server Address", value: `||${serverip}||` },
          { name: "description of server", value: `${response.motd.clean}` },
          {
            name: "Online Players",
            value: `${response.players.online}/${response.players.max}`,
          },
        ],
      }],
    });
  } catch (err) {
    if (err != "Error: Server is offline or unreachable") {
      interaction.createFollowup({
        embeds: [{
          title: "Server status",
          description:
            "Unknown error occured while trying to retrieve server status",
          color: Colors.Warning,
          fields: [{ name: "disconnect reason:", value: `\`\`\`${err}\`\`\`` }],
        }],
      });
      return;
    }
    interaction.createFollowup({
      embeds: [{
        title: "Server status",
        description: "Currently no servers online",
        color: Colors.Error,
        thumbnail: {
          url: "https://cdn.discordapp.com/avatars/419838142510530572/af980f65ee01db127c18dd4809742851.png?size=64",
        },
        fields: [{ name: "Server Address", value: `||${serverip}||` }],
      }],
    }).catch();
  }
};
