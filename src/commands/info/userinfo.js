const { Colors } = require("../../extra/colors");

exports.id = "1048593160886030379";
exports.command = {
  name: "userinfo", // the command name, max 32 characters
  description: "returns info about the selected user",
  options: [
    {
      // target
      type: 6, // user type
      name: "target",
      description: "The user to get info about",
      required: true,
    },
    {
      // category
      type: 3, // string type
      name: "category",
      description: "Will limit the information given",
      choices: [
        { name: "all (same as without category)", value: "all" },
        { name: "avatar", value: "avatar" },
        { name: "id", value: "id" },
        { name: "join dates", value: "joined" },
      ],
    },
  ],
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  const guild = interaction.channel.guild;
  const target = guild.members.get(interaction.data.options.raw[0].value);
  const category = !interaction.data.options.raw[1]
    ? "all"
    : interaction.data.options.raw[1].value;

  let discordTimestamp = target.createdAt / 1000;
  discordTimestamp = Math.floor(discordTimestamp);

  let guildTimestamp = target.joinedAt / 1000;
  guildTimestamp = Math.floor(guildTimestamp);

  const footer = {
    text: `${client.user.username} - userinfo`,
    iconURL: `${client.user.avatarURL("png", 128)}`,
  };

  if (category == "all") {
    let statuses = "desktop: offline, mobile: offline, web: offline";
    cs = target.clientStatus;

    if (cs != null) {
      if (cs.desktop != "offline") {
        statuses = statuses.replace(
          "desktop: offline",
          `desktop: ${cs.desktop}`
        );
      } else {
        statuses = statuses.replace("desktop: offline,", "");
      }
      if (cs.mobile != "offline") {
        statuses = statuses.replace("mobile: offline", `mobile: ${cs.mobile}`);
      } else {
        statuses = statuses.replace("mobile: offline,", "");
      }
      if (cs.web != "offline") {
        statuses = statuses.replace(
          "web: offline",
          !target.bot ? `web: ${cs.web}` : `api: ${cs.web}`
        );
      } else {
        statuses = statuses.replace("web: offline", "");
      }
    } else {
      statuses = "all platforms: offline/invisible";
    }
    interaction.createMessage({
      embeds: [{
        title: `${target.username}'s userinfo ${target.bot == true ? "🤖" : ""}`,
        thumbnail: {
          url: `${target.user.avatarURL(
            guild.icon.startsWith("a_") ? "gif" : "png",
            128
          )}`,
        },
        color: Colors.Neutral,
        description: `
        **General information:**
        **tag:** \`${target.username}#${target.discriminator}\`
        **id:** \`${target.id}\`
        **statuses:** 
        ${statuses}

        **creation:** <t:${discordTimestamp}:R>
        **join:** <t:${guildTimestamp}:R>

        **roles:** ${target.roles
          .map((r) => `<@&${r}>`)
          .join(" | ")
          .replace(" | @everyone", "")}
        `,
        footer: footer,
      }],
    });
  } else if (category == "avatar") {
    interaction.createMessage({
      embeds: [{
        title: `${target.username}'s avatar`,
        image: {
          url: `${target.user.avatarURL(
            guild.icon.startsWith("a_") ? "gif" : "png",
            128
          )}`,
        },
        color: Colors.Neutral,
        footer: footer,
      }],
    });
  } else if (category == "id") {
    interaction.createMessage({
      embeds: [{
        color: Colors.Neutral,
        fields: [
          {
            name: `${target.username}'s id`,
            value: `ID: ${target.id}`,
          },
        ],
        footer: footer,
      }],
    });
  } else if (category == "joined") {
    interaction.createMessage({
      embeds: [{
        color: Colors.Neutral,
        fields: [
          {
            name: `${target.username} joined discord:`,
            value: `<t:${discordTimestamp}> \`<=>\`  <t:${discordTimestamp}:R>`,
          },
          {
            name: `${target.username} joined this server`,
            value: `<t:${guildTimestamp}> \`<=>\`  <t:${guildTimestamp}:R>`,
          },
        ],
        footer: footer,
      }],
    });
  }
};