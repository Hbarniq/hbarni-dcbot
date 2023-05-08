import { Client, GuildComponentButtonInteraction } from 'oceanic.js';

import { colors, icons } from '../../../util/constants.js';
import { getGuildData } from '../../../util/util.js';

export default {
    customID: "Verify",
    exec: async (client: Client, interaction: GuildComponentButtonInteraction) => {
        const guildConfig = await getGuildData(interaction.guildID)

        if (guildConfig?.Configs?.FeatureToggles?.Verification && guildConfig.Configs.Options?.VerifiedRole) {
            return interaction.member.addRole(guildConfig?.Configs?.Options?.VerifiedRole);
        } else {
            return interaction.createMessage({
                flags: 64,
                embeds: [{
                    description: `**${icons.Warning} unable to verify!** \nverification is temporarily disabled in this server`,
                    color: colors.Warning
                }]
            })
        }
    }
}