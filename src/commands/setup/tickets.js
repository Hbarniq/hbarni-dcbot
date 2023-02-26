const { Colors } = require("../../extra/colors");


exports.command = {
  name: "tickets",
  description: "Adds a ticketing system to a channel",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel to do ticketing in",
      channelTypes: [0, 5],
      required: true,
    },
  ],
  type: 1,
  defaultPermission: true,
  defaultMemberPermissions: BigInt(1 << 4),
};
exports.run = async (client, interaction) => {
  const channel = interaction.data.options.getChannel("channel");

  let embed = {
    title: "Support ticket",
    description: "To create a ticket react with 🎫",
    color: Colors.Neutral,
    footer: {
      text: "Hbarni bot - tickets",
      iconURL:
        "https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.webp",
    },
  }

  if (interaction.guild.id == "1036322425811513484") {
    embed = Object.assign({}, embed, {image: {url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050694052397465631/tickets.png"}})
  }

  await interaction.guild.channels.find((c) => c.id == channel.id).createMessage({
    embeds: [embed],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "Create a ticket",
            style: 2,
            customID: "ticketCreate",
            emoji: {
              id: null,
              name: "🎫",
            },
          },
        ],
      },
    ],
  });

  interaction.createMessage({ flags: 64, content: `Created support ticket prompt in <#${channel.id}> ✅` });
};
