const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild")

module.exports = {
    data: {
      name: "bridgeButton",
    },
    async run(client, interaction) {
        await interaction.defer(64)
        const id = interaction.data.custom_id
        const guildProfile = await guild.findOne({
            guildId: interaction.channel.guild.id,
        });
        const recievedFromProfile = await guild.findOne({
            guildId: guildProfile.bridges.find((b) => b.id == interaction.channel.id).bridgedWith.guildId
        })
        const recievedFromChannel = recievedFromProfile.bridges.find((b) => b.bridgedWith.channelId == interaction.channel.id)

        switch (id) {
            case "bridge_accept":
                guildProfile.bridges.find((b) => b.id == interaction.channel.id).pending = false
                recievedFromProfile.bridges.find((b) => b.bridgedWith.channelId == interaction.channel.id).pending = false
                await guildProfile.save().catch()
                await recievedFromProfile.save().catch()
                client.createMessage(recievedFromChannel.id, {
                    embed: {
                        title: "success!",
                        description: `This channel has been bridged with <#${interaction.channel.id}>`,
                        color: 0x57f287,
                      },
                })
                success(`Bridged with <#${recievedFromChannel.id}>`, interaction)
                interaction.message.edit({
                    embed: {
                        title: "bridged channels!",
                        description: `successfully paired with <#${recievedFromChannel.id}>`,
                        color: 0x57f287,
                    },
                    components: []
                })
                break;

            case "bridge_decline":
                await guildProfile.updateOne({ $pull: { bridges: { id: interaction.channel.id }}})
                await recievedFromProfile.updateOne({ $pull: { bridges: { id: recievedFromChannel.id }}})
                client.createMessage(recievedFromChannel.id, {
                    embed: {
                        title: "warning!",
                        description: `Bridge request declined..`,
                        color: 0xe67e22
                    }
                })
                success("Bridge request declined", interaction)
                interaction.message.edit({
                    embed: {
                        title: "declined bridge request!",
                        description: `successfully declined pairing with <#${recievedFromChannel.id}>`,
                        color: 0x57f287,
                    },
                    components: []
                })
                break;
        
            default:
                break;
        }
    }
}