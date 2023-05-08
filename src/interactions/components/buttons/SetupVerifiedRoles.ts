import { Client, Constants, GuildComponentButtonInteraction } from 'oceanic.js';

import { colors, icons } from '../../../util/constants.js';
import { getGuildData } from '../../../util/util.js';

export default {
    customID: "SetupVerifiedRoles",
    exec: async (client: Client, interaction: GuildComponentButtonInteraction) => {
        interaction.defer(64)
        const guildConfig = await getGuildData(interaction.guildID)

        await interaction.guild.roles.find(r => r.id == guildConfig?.Configs?.Options?.VerifiedRole)?.edit({
            permissions: "143985593921",
            reason: "setup verification"
        }).catch(err => console.error(err))

        await interaction.guild.roles.find(r => r.id == interaction.guild.id)?.edit({
            permissions: "0"
        })

        await interaction.guild.channels.find(c => c.id == guildConfig?.Configs?.Options?.VerificationChannel)?.edit({
            permissionOverwrites: [
                { type: 0, allow: "0", deny: "1024", id: guildConfig?.Configs?.Options?.VerifiedRole as string},
                { type: 0, allow: "2147550208", deny: "0", id: interaction.guildID}
            ]
        })

        interaction.createFollowup({
            embeds: [{
                description: `
                **${icons.Cogwheel} roles updated!**
                you should make sure that all permissions on <@&${guildConfig?.Configs?.Options?.VerifiedRole}> are fine
                `,
                color: colors.Neutral
            }]
        })
        
        sendVerificationPrompt(interaction)
    }
}

export async function sendVerificationPrompt(interaction: GuildComponentButtonInteraction) {
    const guildConfig = await getGuildData(interaction.guildID)
    await interaction.message.delete()

    if ((await interaction.client.rest.channels.getMessages(guildConfig?.Configs?.Options?.VerificationChannel as string, {limit: 1}))[0].author.id == interaction.client.user.id) return;
    await interaction.client.rest.channels.createMessage(guildConfig?.Configs?.Options?.VerificationChannel as string, {
        embeds: [{
            title: "Verify!",
            description: `click on the verifify button to get access to ${interaction.guild?.name}`,
            color: colors.Neutral
        }],
        components: [{
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [{
                type: Constants.ComponentTypes.BUTTON,
                customID: "Verifiy",
                label: "Verify",
                style: Constants.ButtonStyles.PRIMARY
            }]
        }]
    })
}