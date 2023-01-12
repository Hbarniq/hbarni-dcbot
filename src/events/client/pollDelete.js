const { Colors } = require("../../extra/colors");
const guild = require("../../schemas/guild");
module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    const guildProfile = await guild.findOne({
        guildId: message.channel.guild.id,
      }).catch();
    let poll = guildProfile.polls.find((p) => p.id == message.id)
    if (poll != undefined) {
        await guildProfile.updateOne({ $pull: { polls: { id: poll.id } } });
        message.channel.createMessage({
            embeds: [{
                title: "warning!",
                description: `Poll: \`${message.id}\` has been deleted, poll data erased!`,
                color: Colors.Warning
            }]
        })
    }
  },
};
// removes unused DB document