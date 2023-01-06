const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild")

module.exports = {
    data: {
      name: "pollButton",
    },
    async run(client, interaction) {
        await interaction.defer(64)
        const id = interaction.data.custom_id
        const guildProfile = await guild.findOne({
            guildId: interaction.channel.guild.id,
        });
        const poll = guildProfile.polls.find((p) => p.id == interaction.message.id)

        if (poll.voters.includes(interaction.member.id)) {
            return error("You already voted on this poll!", interaction)
        }

        poll.voters.push(interaction.member.id)
        poll.values.find((v) => v.id == id).votes += 1
        await guildProfile.save().catch()

        success("Your vote has been submitted!", interaction)
    }
}