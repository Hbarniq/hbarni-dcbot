const { Colors } = require("../../extra/colors");
const { error } = require("../../extra/replyFunc");

exports.command = {
  name: "invite",
  description: "sends the most used invite to the current server",
  type: 1,
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  const invites = await client.rest.guilds.getInvites(interaction.guild.id);
  if (invites.length <= 0) {
    if (!interaction.member.permissions.has("CREATE_INSTANT_INVITE")) {
        return error("There are no available invites for this server and you dont have permissions to create one..")
    }

    const createdInvite = await client.rest.channels.createInvite(interaction.channel.id, { reason: `created by: ${interaction.member.username}` })
    return interaction.createMessage({
        flags: 64,
        embeds: [{
            title: "here is your invite",
            description: `new invite created as there werent any available\nhttps://discord.gg/${createdInvite.code}`,
            color: Colors.Neutral
        }]
    })
  }

  const mostUsed = invites.reduce(function(max, obj) {
    return obj.uses > max.uses ? obj : max;
  });

  return interaction.createMessage({
    flags: 64,
    embeds: [{
        title: "here is your invite!",
        description: `the currently most used invite for this server is\nhttps://discord.gg/${mostUsed.code}`,
        color: Colors.Neutral
    }]
  })
};
