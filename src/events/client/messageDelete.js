const { warning } = require("../../extra/replyFunc");
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
        client.createMessage(message.channel.id, {
            embed: {
                title: "warning!",
                description: `Poll: \`${message.id}\` has been deleted, poll data erased!`,
                color: 0xe67e22
            }
        })
    }
  },
};
// removes unused DB document