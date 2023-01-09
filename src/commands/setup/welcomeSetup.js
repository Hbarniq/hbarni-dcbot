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
      channel_types: [0, 5],
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
  default_member_permissions: BigInt(1 << 3),
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  let guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  const disable = interaction.data.options.find((o) => o.name == "disable");
  if (disable != undefined && disable.value && guildProfile.welcome.using) {
    guildProfile.welcome = undefined;
    await guildProfile.save().catch();
    return interaction.createMessage({
      flags: 64,
      embed: {
        title: "settings updated!",
        description: "successfully disabled welcome messages",
        color: 0x57f287,
      },
    });
  } else if (
    disable != undefined &&
    disable.value &&
    !guildProfile.welcome.using
  ) {
    return await interaction.createMessage({
      flags: 64,
      embed: {
        title: "oops... something went wrong",
        description:
          "You aren't using welcome messages.. only use the disable option if you have them enabled and you want to disable them",
        color: 0xed4245,
      },
    });
  }

  await guildProfile.updateOne({
    welcome: {
      using: true,
      welcomeChannel: interaction.data.options[0].value,
    },
  });

  await guildProfile.save().catch(console.error);

  interaction.createMessage({
    embed: {
      title: "success!",
      description: `welcome messages will start appearing in <#${interaction.data.options[0].value}> ✅`,
      color: 0x57f287,
    },
  });
};
