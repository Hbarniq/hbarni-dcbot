const axios = require("axios");
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
      return interaction.createMessage({
        flags: 64,
        embed: {
          title: "oops.. something went wrong",
          description:
            "You have already created a ticket, close it before creating a new one",
          color: 0xed4245,
        },
      });
    }
    await axios({
      method: "POST",
      url: `https://discord.com/api/interactions/${interaction.id}/${interaction.token}/callback`,
      headers: {
        Authorization: `Bot ${client.token}`,
      },
      data: {
        type: 9, //modal type
        data: {
          title: "Create a ticket!",
          custom_id: "ticketModal",
          components: [
            {
              type: 1, //actionRowBuilder
              components: [
                {
                  type: 4, //modal text input
                  custom_id: "ticketReasonInput",
                  label: "Why are you opening a ticket?",
                  placeholder:
                    'help the modpack doesnt want to start and it says "Error code: 69420" here is my latest.log',
                  style: 2, // paragraph
                  min_length: 1,
                  max_length: 2000,
                  required: true,
                },
              ],
            },
          ],
        },
      },
    });
  },
};
