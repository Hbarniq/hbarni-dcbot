const guild = require("../../schemas/guild");
exports.id = "1048593160886030383";
exports.command = {
  name: "verifysetup",
  description: "specificly for the AHMS discord server",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel for verification",
      channel_types: [0, 5],
      required: true,
    },
    {
      type: 8,
      name: "verified_role",
      description:
        "the role you want verification to give (your default member role)",
      required: false,
    },
    {
      type: 5,
      name: "disable",
      description: "only use this if you want to disable verification",
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
  if (
    disable != undefined &&
    disable.value &&
    guildProfile.verification.using
  ) {
    guildProfile.verification = undefined;
    await guildProfile.save().catch();
    return interaction.createMessage({
      flags: 64,
      embed: {
        title: "settings updated!",
        description: "successfully disabled verification",
        color: 0x57f287,
      },
    });
  } else if (
    disable != undefined &&
    disable.value &&
    !guildProfile.verification.using
  ) {
    return await interaction.createMessage({
      flags: 64,
      embed: {
        title: "oops... something went wrong",
        description:
          "You aren't using verification.. only use the disable option if you have verification enabled and you want to disable it",
        color: 0xed4245,
      },
    });
  }

  if (!guildProfile.verification.using) {
    if (!interaction.data.options[1]) {
      return await interaction.createMessage({
        flags: 64,
        embed: {
          title: "oops... something went wrong",
          description:
            "Your server's data hasnt been saved yet.. please define a verified role when running this command",
          color: 0xed4245,
        },
      });
    }
    await guildProfile.updateOne({
      verification: {
        using: true,
        verifiedRoleId: interaction.data.options[1].value,
      },
    });

    await guildProfile.save().catch(console.error);
  }

  const channel = interaction.data.options[0].value;

  await client.createMessage(channel, {
    embed: {
      title: "Welcome to AHMS",
      description:
        "Please verify by clicking the 'Verify' button \nand get access to all channels\nYou might have to click \"Complete\" to be able to use the button",
      image: {
        url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050692966013992970/verify.png",
      },
      color: 0x57f287,
    },
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "verify",
            style: 3,
            custom_id: "verifyMember",
            emoji: {
              id: null,
              name: "✅",
            },
          },
        ],
      },
    ],
  });

  interaction.createMessage({
    embed: {
      title: "success!",
      description: `created verification prompt in <#${channel}> ✅`,
      color: 0x57f287,
    },
  });
};
