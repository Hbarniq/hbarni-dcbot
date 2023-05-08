import { Client, Member } from 'oceanic.js';

import { getGuildData } from '../../util/util.js';
import { colors } from '../../util/constants.js';

export default {
  name: "guildMemberAdd",
  exec: async (client: Client, member: Member) => {
    const guildConfig = await getGuildData(member.guildID)
    if (!guildConfig?.Configs?.FeatureToggles?.Welcome) return;

    if (guildConfig.Configs.Options?.WelcomeAssignedRole) {
        await member.addRole(guildConfig.Configs.Options.WelcomeAssignedRole);
    }

    if (guildConfig.Configs.Options?.WelcomeMessageChannel) {
        client.rest.channels.createMessage(guildConfig.Configs.Options?.WelcomeMessageChannel, {
          embeds: [{
            description:  `**Hi there ${member.username}**\nwelcome to ${member.guild.name}`,
            color: colors.Neutral
          }]
        })
    }
  }
};
