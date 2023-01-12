const { Colors } = require("../../extra/colors");
const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild")

module.exports = {
    data: {
      name: "bridgeButton",
    },
    async run(client, interaction) {
        await interaction.defer(64)
        const id = interaction.data.customID
        const guildProfile = await guild.findOne({
            guildId: interaction.channel.guild.id,
        });
        const recievedFromProfile = await guild.findOne({
            guildId: guildProfile.bridges.find((b) => b.id == interaction.channel.id).bridgedWith.guildId
        })
        const recievedFromChannel = await client.rest.channels.get(guildProfile.bridges.find((b) => b.id == interaction.channel.id).bridgedWith.channelId)

        if (!interaction.member.permissions.has(BigInt(1 << 4))) {
            return error("You dont have permissions to accept/decline a bridge request")
        }

        switch (id) {
            case "bridge_accept":
                guildProfile.bridges.find((b) => b.id == interaction.channel.id).pending = false
                recievedFromProfile.bridges.find((b) => b.bridgedWith.channelId == interaction.channel.id).pending = false
                await guildProfile.save().catch()
                await recievedFromProfile.save().catch()
                recievedFromChannel.createMessage({
                    embeds: [{
                        title: "success!",
                        description: `This channel has been bridged with <#${interaction.channel.id}>`,
                        color: Colors.Success,
                      }],
                })
                success(`Bridged with <#${recievedFromChannel.id}>`, interaction)
                interaction.message.edit({
                    embeds: [{
                        title: "bridged channels!",
                        description: `successfully paired with <#${recievedFromChannel.id}>`,
                        color: Colors.Success,
                    }],
                    components: []
                })
                break;

            case "bridge_decline":
                await guildProfile.updateOne({ $pull: { bridges: { id: interaction.channel.id }}})
                await recievedFromProfile.updateOne({ $pull: { bridges: { id: recievedFromChannel.id }}})
                recievedFromChannel.createMessage({
                    embeds: [{
                        title: "warning!",
                        description: `Bridge request declined..`,
                        color: Colors.Warning
                    }]
                })
                success("Bridge request declined", interaction)
                interaction.message.edit({
                    embeds: [{
                        title: "declined bridge request!",
                        description: `successfully declined pairing with <#${recievedFromChannel.id}>`,
                        color: Colors.Success,
                    }],
                    components: []
                })
                break;
        
            default:
                break;
        }
    }
}