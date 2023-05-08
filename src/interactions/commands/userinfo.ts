import { ApplicationCommandTypes, Client, CommandInteraction } from 'oceanic.js';

import { colors } from '../../util/constants.js';
import { discordTime, dynamicAvatarURL } from '../../util/util.js';

export default {
    command: {
        name: "user-info",
        type: ApplicationCommandTypes.USER,
    },
    exec: async (client: Client, interaction: CommandInteraction) => {
        var target = interaction.guild?.members.find(m => m.id == interaction.data.targetID)

        return interaction.createMessage({
            flags: 64,
            embeds: [{
                description: `
                **User info**:
                Id: \`${target?.id}\`
                Name: \`${target?.user.tag}\`
                Joined Discord: <t:${discordTime(target?.user.createdAt as Date)}:R>\
                ${target?.bot ? "\nBot: `yes`" : ""}

                **Member info:**
                Joined ${interaction.guild?.name}: <t:${discordTime(target?.joinedAt as Date)}:R>
                Roles: ${target?.roles.length ? target?.roles.slice(0, 8).map(r => ` <@&${r}>`) : "none"}${target?.roles.length as number > 8 ? "..." : ""}\
                ${target?.premiumSince && target.premiumSince?.valueOf() > Date.now()
                    ? `\nBoosting since <t:${discordTime(target.premiumSince)}:R>` : ""}\
                ${target?.communicationDisabledUntil && target.communicationDisabledUntil.valueOf() > Date.now() 
                    ? `\nTimeout ending <t:${discordTime(target.communicationDisabledUntil)}:R>` : ""}
                `,
                author: {
                    name: `${target?.nick ?? target?.user.username}`,
                    iconURL: dynamicAvatarURL(target)
                },
                color: colors.Neutral
            }]
        })
    }
}