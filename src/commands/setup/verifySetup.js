const { Colors } = require("../../extra/colors");
const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild");

exports.command = {
  name: "verifysetup",
  description: "specificly for the AHMS discord server",
  options: [
    {
      type: 7,
      name: "channel",
      description: "the channel for verification",
      channelTypes: [0, 5],
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
  defaultMemberPermissions: BigInt(1 << 3),
};
exports.run = async (client, interaction) => {
  let guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  const disable = interaction.data.options.raw.find((o) => o.name == "disable");
  if (
    disable != undefined &&
    disable.value &&
    guildProfile.verification.using
  ) {
    guildProfile.verification = undefined;
    await guildProfile.save().catch();
    return interaction.createMessage({
      flags: 64,
      embeds: [{
        title: "settings updated!",
        description: "successfully disabled verification",
        color: Colors.Success,
      }],
    });
  } else if (disable != undefined &&disable.value &&!guildProfile.verification.using) { 
    return error("You aren't using verification.. only use the disable option if you have verification enabled and you want to disable it", interaction) 
  }

  if (!guildProfile.verification.using) {
    if (!interaction.data.options.raw[1]) {
      return error("Your server's data hasnt been saved yet.. please define a verified role when running this command", interaction)
    }
    await guildProfile.updateOne({
      verification: {
        using: true,
        verifiedRoleId: interaction.data.options.raw[1].value,
      },
    });
  }

  let channel = interaction.data.options.raw[0].value;
  channel = await client.rest.channels.get(channel)

  await channel.createMessage({
    embeds: [{
      title: `Welcome to ${interaction.guild.name}`,
      description:
        "Please verify by clicking the 'Verify' button \nand get access to all channels\nYou might have to click \"Complete\" to be able to use the button",
      image: {
        url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050692966013992970/verify.png",
      },
      color: Colors.Success,
    }],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "verify",
            style: 3,
            customID: "verifyMember",
            emoji: {
              id: null,
              name: "✅",
            },
          },
        ],
      },
    ],
  });

  success(`created verification prompt in <#${channel.id}> ✅`, interaction)
};
