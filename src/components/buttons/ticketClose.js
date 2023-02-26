const guild = require("../../schemas/guild");

module.exports = { // modals https://www.youtube.com/watch?v=Yu0jnPXKJSo (Eris doesnt have an official way of doin this)
    data: {
      name: "ticketClose",
    },
    async run(client, interaction) {
        const guildProfile = await guild.findOne({ guildId: interaction.channel.guild.id })
        guildProfile.tickets.splice(guildProfile.tickets.indexOf({ creator: interaction.member.id }, 1))
        guildProfile.save().catch()
        if (interaction.channel.type != 12) return;
        interaction.channel.delete()
    }
}