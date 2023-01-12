const guild = require("../../schemas/guild");
module.exports = {
  data: {
    name: "ticketModal",
  },
  async run(client, interaction) {
    const guildProfile = await guild.findOne({ guildId: interaction.channel.guild.id })
    const reason = (interaction.data.customID = "ticketReasonInput"
      ? interaction.data.components[0].components[0].value
      : "reason not given");

    const thread = await interaction.channel.startThreadWithoutMessage({
      name: `${interaction.member.username}'s ticket`,
      autoArchiveDuration: 60,
      invitable: true,
      type: 12, //private thread https://discord.com/developers/docs/resources/channel#channel-object-channel-types
    });

    interaction.createMessage({
      flags: 64,
      embeds: [{
        description: `**Success** 🎫\nYour ticket has been created\nhere it is: <#${thread.id}>`,
        color: 0x57f287,
      }],
    });
    thread.createMessage({
      embeds: [
        {
          // reason
          title: "Ticket reason:",
          description: `${reason.replace(/[\r\n]/gm, " ")}`,
          color: 0x5865f2,
        },
        {
          // ticketClose
          description:
            "**You created a ticket!**\nmention staff to add them\nTo close the ticket react with 🔒",
          color: 0x57f287,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "close",
              style: 2,
              customID: "ticketClose",
              emoji: {
                id: null,
                name: "🔒",
              },
            },
          ],
        },
      ],
    });
    client.rest.channels.addThreadMember(thread.id, interaction.member.id)
    guildProfile.tickets.push({
      thread: thread.id,
      creator: interaction.member.id
    })
    await guildProfile.save().catch()
  },
};
