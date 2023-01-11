module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!(message.guild.id == "994577647155822622" && message.channel.id == "994577647155822626")) return;
    if (message.author.bot) return;

    client.createMessage("1018943780172345405", {
        embed: {
            description: message.content,
            author: {
                name: message.member.username,
                icon_url: message.author.dynamicAvatarURL(message.author.avatar.startsWith("a_") ? "gif" : "png", 128)
            },
            color: 0x206694,
        },
    })
    
  },
};
// used for forwarding from 1 specific channel to another
