const { Colors } = require("../../extra/colors");
const guild = require("../../schemas/guild");
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const guildProfile = await guild.findOne({
        guildId: message.channel.guild.id,
      }).catch();
    if (guildProfile.bridges == undefined) return;

    const bridge = guildProfile.bridges.find((b) => b.id == message.channel.id)
    if (bridge == undefined || bridge.pending || message.author.bot) return;

    let avatar;
    if (message.author.avatar)
    avatar = message.author.avatarURL(
      message.author.avatar.startsWith("a_") ? "gif" : "png", 128
    );
    else avatar = "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico";

    client.guilds.find((g) => g.id == guildProfile.bridges.find((b) => b.id == message.channel.id).bridgedWith.guildId).channels.find((c) => c.id == guildProfile.bridges.find((b) => b.id == message.channel.id).bridgedWith.channelId)
    .createMessage({
      embeds: [{
        description: message.referencedMessage != null ? `reply to: <@${message.referencedMessage.author.id}>\n\n${message.content}` : message.content,
        author: {
          name: message.member.username,
          iconURL: avatar
        },
        color: Colors.Neutral,
      }]
    })
    
  },
};
