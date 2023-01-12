exports.id = "1048593160886030381";
exports.command = {
  name: "infosetup",
  description: "specificly for the AHMS discord server",
  type: 1,
  defaultPermission: false,
  defaultMemberPermissions: BigInt(1 << 3),
};
exports.run = async (client, interaction) => {
  if (interaction.guild.id != "1036322425811513484") return;

  await interaction.channel.createMessage({
    embeds: [{
      title: "Get info about AHMS :D",
      description: "Choose what you want info about from the menu",
      image: {
        url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050692389892796437/info.png",
      },
      color: 0x5865f2,
    }],
    components: [
      {
        type: 1, //actionrow
        components: [
          {
            type: 3, //selectmenu
            customID: "infoMenu",
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

  interaction.createMessage({ flags: 64, content: `Created info menu ✅` });
};
