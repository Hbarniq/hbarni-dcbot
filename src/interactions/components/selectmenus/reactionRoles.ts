import { Client, GuildComponentSelectMenuInteraction } from "oceanic.js";
import { colors, icons } from "../../../util/constants.js";

export default {
    customID: "reactionRoles",
    exec: async (client: Client, interaction: GuildComponentSelectMenuInteraction) => {
        interaction.defer(64)
        const roleIds = interaction.data.values.getStrings();
        let added: string[] = [];
        let removed: string[] = [];

        roleIds.forEach(async r => {
            if (interaction.member.roles.includes(r)) {
                removed.push(`<@&${r}>`)
                await interaction.member.removeRole(r)
            } else {
                added.push(`<@&${r}>`)
                await interaction.member.addRole(r)
            }
        })

        interaction.createFollowup({
            embeds: [{
                description: `**${icons.Cogwheel} roles updated!** \
                ${added.length ? `\nadded: ${added}`: ""} \
                ${removed.length ? `\nremoved: ${removed}`: ""} \
                `,
                color: colors.Neutral
            }]
        })

    }
}