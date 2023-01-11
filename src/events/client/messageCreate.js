const guild = require("../../schemas/guild");
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const guildProfile = await guild.findOne({
        guildId: message.channel.guild.id,
      }).catch();
    const bridge = guildProfile.bridges.find((b) => b.id == message.channel.id)
    if (bridge == undefined || bridge.pending || message.author.bot) return;

    client.createMessage(bridge.bridgedWith.channelId, {
      embed: {
        description: message.content,
        author: {
          name: message.member.username,
          icon_url: message.member.avatarURL
        },
        color: 0x206694,
      }
    })
    
  },
};
// removes unused DB document
