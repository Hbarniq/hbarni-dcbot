const { Colors } = require("../../extra/colors");
const { success, error } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild");
exports.id = "1053763811129167923";
exports.command = {
  name: "welcomesetup",
  description: "welcome messages when a user joins",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel for welcome messages",
      channelTypes: [0, 5],
      required: true,
    },
    {
      type: 5,
      name: "disable",
      description: "only use this if you want to disable welcome messages",
      required: false,
    },
  ],
  type: 1,
  defaultPermission: true,
  defaultMemberPermissions: BigInt(1 << 3),
};
exports.run = async (client, interaction) => {
  await interaction.defer(64)
  let guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  const disable = interaction.data.options.raw.find((o) => o.name == "disable");
  if (disable != undefined && disable.value && guildProfile.welcome.using) {
    guildProfile.welcome = undefined;
    await guildProfile.save().catch();
    return interaction.createFollowup({
      flags: 64,
      embeds: [{
        title: "settings updated!",
        description: "successfully disabled welcome messages",
        color: Colors.Success,
      }],
    });
  } else if (
    disable != undefined &&
    disable.value &&
    !guildProfile.welcome.using
  ) {
    return error("You aren't using welcome messages.. only use the disable option if you have them enabled and you want to disable them", interaction)
  }

  await guildProfile.updateOne({
    welcome: {
      using: true,
      welcomeChannel: interaction.data.options.raw[0].value,
    },
  });

  success(`welcome messages will start appearing in <#${interaction.data.options.raw[0].value}> ✅`, interaction)
};
