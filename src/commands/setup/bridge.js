const guild = require("../../schemas/guild");
const { error, success } = require("../../extra/replyFunc");
const { Colors } = require("../../extra/colors");

exports.command = {
  name: "bridge",
  description:
    "for connecting 2 channels in 2 different servers with eachother",
  options: [
    {
      type: 3,
      name: "action",
      description: "specify what you want the command to do",
      required: true,
      choices: [
        {
          name: "add bridge",
          value: "bridge",
        },
        {
          name: "remove bridge",
          value: "unbridge",
        },
      ],
    },
    {
      type: 3,
      name: "server_id",
      description: "the Id of the server to connect with",
      required: true,
    },
    {
      type: 3,
      name: "channel_id",
      description: "the channel's Id in that server to connect with",
      required: true,
    },
  ],
  type: 1,
  defaultPermission: true,
  defaultMemberPermissions: BigInt(1 << 4),
};
exports.run = async (client, interaction) => {
  const action = interaction.data.options.getString("action")
  const guildId = interaction.data.options.getString("server_id")
  const channelId = interaction.data.options.getString("channel_id")
  const guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  const otherProfile = await guild.findOne({
    guildId: guildId,
});
  const isID = (id) => {
    /(\d{15,23})/gm.test(id);
  };

  if (isID(guildId) == false)
    return error("Invalid serverId.. enable developer mode and copy the id of the server to connect to", interaction);
  if (isID(channelId) == false)
    return error("Invalid channelId.. enable developer mode and copy the id of the channel to connect to", interaction);
  if (guildId == interaction.channel.guild.id) {
    return error("Cant connect channels inside the same server", interaction);
  }

  switch (action) {
    case "bridge":
      if (guildProfile.bridges && otherProfile.bridges) {
      if (guildProfile.bridges.find((b) => b.id == interaction.channel.id) != undefined || otherProfile.bridges.find((b) => b.bridgedWith.channelId == interaction.channel.id) != undefined) {
        return error("Cant bridge multiple channels to one", interaction)
        }
      }
      await client.guilds.find((g) => g.id == guildId).channels.find((c) => c.id == channelId)
      .createMessage({
        flags: 64,
        embeds: [{
          title: "Bridge request!",
          description: `This channel got a bridge request from **${interaction.channel.guild.name}**\nIf accepted this will connect this channel with <#${interaction.channel.id}>`,
          color: Colors.Neutral,
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "accept",
                style: 3,
                customID: "bridge_accept",
              },
              {
                type: 2,
                label: "decline",
                style: 4,
                customID: "bridge_decline",
              },
            ],
          },
        ],
      }).catch(err => {
        console.log(err)
        return error("Failed to send bridge request.. make sure the ids are correct", interaction)
      });

      const sentToProfile = await guild.findOne({
        guildId: guildId,
      });

      guildProfile.bridges.push({
        id: interaction.channel.id,
        pending: true,
        bridgedWith: {
          channelId: channelId,
          guildId: guildId,
        },
      });
      sentToProfile.bridges.push({
        id: channelId,
        pending: true,
        bridgedWith: {
          channelId: interaction.channel.id,
          guildId: interaction.channel.guild.id,
        },
      });
      await guildProfile.save().catch();
      await sentToProfile.save().catch();

      success("Sent bridge request!", interaction);

      break;

    case "unbridge":
        if (!otherProfile) {
            return error("Server to remove not found.. make sure server_id is valid", interaction)
        }
        if (guildProfile.bridges.find((b) => b.id == interaction.channel.id) == undefined) {
            return error("There are no bridges set for this channel", interaction)
        }

        await client.guilds.find((g) => g.id == guildId).channels.find((c) => c.id == guildProfile.bridges.find((b) => b.bridgedWith.guildId == guildId).bridgedWith.channelId)
        .createMessage({
          embeds: [{
              title: "warning!",
              description: `Bridge disconnected by: <@${interaction.member.id}>`,
              color: Colors.Warning
          }]
      })

        const toRemove = otherProfile.bridges.find((b) => b.bridgedWith.channelId == interaction.channel.id).id
        await guildProfile.updateOne({ $pull: { bridges: { id: interaction.channel.id }}})
        await otherProfile.updateOne({ $pull: { bridges: { id: toRemove }}})

        success("Bridge disconnected..", interaction)

      break;

    default:
      break;
  }
};
