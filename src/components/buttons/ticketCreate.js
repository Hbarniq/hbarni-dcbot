const { Colors } = require("../../extra/colors");
const { error } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild");
module.exports = {
  // modals https://www.youtube.com/watch?v=Yu0jnPXKJSo (Eris doesnt have an official way of doin this)
  data: {
    name: "ticketCreate",
  },
  async run(client, interaction) {
    const guildProfile = await guild.findOne({
      guildId: interaction.channel.guild.id,
    });
    const hasTicket = guildProfile.tickets.some(function (t) {
      return t.creator === interaction.member.id;
    });

    if (hasTicket) {
      return error("You have already created a ticket, close it before creating a new one", interaction)
    }

    interaction.createModal({
      title: "Create a ticket!",
      customID: "ticketModal",
      components: [
        {
          type: 1, //actionRowBuilder
          components: [
            {
              type: 4, //modal text input
              customID: "ticketReasonInput",
              label: "Why are you opening a ticket?",
              placeholder:
                'help the modpack doesnt want to start and it says "Error code: 69420" here is my latest.log',
              style: 2, // paragraph
              minLength: 1,
              maxLength: 2000,
              required: true,
            },
          ],
        },
      ],
    },)
  },
};
