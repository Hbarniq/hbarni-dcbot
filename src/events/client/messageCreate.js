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
    avatar = message.author.dynamicAvatarURL(
      message.author.avatar.startsWith("a_") ? "gif" : "png", 128
    );
    else avatar = "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico";

    client.createMessage(bridge.bridgedWith.channelId, {
      embed: {
        description: message.referencedMessage ? `reply to: <@${message.referencedMessage.author.id}>\n\n${message.content}` : message.content,
        author: {
          name: message.member.username,
          icon_url: avatar
        },
        color: 0x206694,
        attachments: message.attachments
      }
    })
    
  },
};
