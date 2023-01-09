exports.id = "1048593160886030382"
exports.command = {
  name: "tickets",
  description: "Adds a ticketing system to a channel",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel to do ticketing in",
      channel_types: [0, 5],
      required: true,
    },
  ],
  type: 1,
  defaultPermission: true,
  default_member_permissions: BigInt(1 << 4),
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  const channel = interaction.data.options[0].value;

  let embed = {
    title: "Support ticket",
    description: "To create a ticket react with 🎫",
    color: 0x5865f2,
    footer: {
      text: "Hbarni bot - tickets",
      icon_url:
        "https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.webp",
    },
  }

  if (interaction.channel.guild.id == "1036322425811513484") {
    embed = await Object.assign({}, embed, {image: {url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050694052397465631/tickets.png"}})
  }

  await client.createMessage(channel, {
    embed: embed,
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "Create a ticket",
            style: 2,
            custom_id: "ticketCreate",
            emoji: {
              id: null,
              name: "🎫",
            },
          },
        ],
      },
    ],
  });

  interaction.createMessage({ content: `Created support ticket prompt in <#${channel}> ✅` });
};
