import { Client, GuildComponentButtonInteraction } from 'oceanic.js';

import { colors, icons } from '../../../util/constants.js';
import { sendVerificationPrompt } from './SetupVerifiedRoles.js';

export default {
    customID: "SkipSetupVerifiedRoles",
    exec: async (client: Client, interaction: GuildComponentButtonInteraction) => {
        interaction.createMessage({
            flags: 64,
            embeds: [{
                description: `
                **${icons.Cogwheel} setup skipped!**
                you can give your roles permissions manually :)
                `,
                color: colors.Neutral
            }]
        })

        sendVerificationPrompt(interaction)
    }
}