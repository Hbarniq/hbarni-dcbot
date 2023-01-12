const guild = require("../../schemas/guild");
module.exports = {
  data: {
    name: "reactionRoles",
  },
  async run(client, interaction) {
    await interaction.defer(64)
    const selected = interaction.data.values.raw;
    const member = interaction.member;
    const guildProfile = await guild.findOne({
      guildId: interaction.channel.guild.id,
    });
    const all_roles = guildProfile.reaction_roles.roles.map((o) => o.id);
    const memberRoles = all_roles.filter((r) => member.roles.includes(r)); // to not look through every role each time

    // all this logic to not send unnecessary requests to discord
    if (memberRoles.length != 0) {
        for (let i = 0; i < memberRoles.length; i++) {
            const roleId = memberRoles[i];
            const hasRole = memberRoles.includes(roleId);

            if (hasRole && !selected.includes(roleId)) {
                await member.removeRole(roleId, "member chose to remove role")
            }
        }
    }

    for (let i = 0; i < selected.length; i++) {
      const roleId = selected[i];
      const hasRole = memberRoles.includes(roleId);
     
      if (!hasRole) {
        await member.addRole(roleId, "member chose to add role");
      }
    }

    interaction.createFollowup({
        flags: 64,
        embeds: [{
          title: "success!",
          description: `Your roles have been updated`,
          color: 0x57f287,
        }],
    })
  },
};
