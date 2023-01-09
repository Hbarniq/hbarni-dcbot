exports.id = "1048593160886030381";
exports.command = {
  name: "infosetup",
  description: "specificly for the AHMS discord server",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel to show info selectmenu in",
      channel_types: [0, 5],
      required: true,
    },
  ],
  type: 1,
  defaultPermission: false,
  default_member_permissions: BigInt(1 << 3),
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  const channel = interaction.data.options[0].value;

  await client.createMessage(channel, {
    embed: {
      title: "Get info about AHMS :D",
      description: "Choose what you want info about from the menu",
      image: {
        url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050692389892796437/info.png",
      },
      color: 0x5865f2,
    },
    components: [
      {
        type: 1, //actionrow
        components: [
          {
            type: 3, //selectmenu
            custom_id: "infoMenu",
            placeholder: "Select what you want info about",
            options: [
              {
                label: "rules",
                description: "the rules of the server",
                emoji: {
                  id: null,
                  name: "📜",
                },
                value: "rulesEmbed",
              },
              {
                label: "faq",
                description: "general information/faq about AHMS",
                emoji: {
                  id: null,
                  name: "❓",
                },
                value: "infoEmbed",
              },
              {
                label: "modpack help",
                description: "help with installing/updating the modpack",
                emoji: {
                  id: null,
                  name: "📑",
                },
                value: "installEmbed",
              },
              {
                label: "custom content help",
                description:
                  "help with creating custom things like emotes or blocks",
                emoji: {
                  id: null,
                  name: "🎨",
                },
                value: "customEmbed",
              },
            ],
          },
        ],
      },
    ],
  });

  interaction.createMessage({ content: `Created info menu in <#${channel}> ✅` });
};
