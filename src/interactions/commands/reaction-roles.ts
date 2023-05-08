import { CommandInteraction, Client, Constants, SelectOption } from 'oceanic.js';
import { parseOptionValue } from '../../util/configUtil.js';
import { colors, icons } from '../../util/constants.js';
import { extractEmoji } from './poll.js';

export default {
    command: {
        name: "reaction-roles",
        description: "create reaction role prompts",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        defaultMemberPermissions: Constants.Permissions.MANAGE_ROLES,
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: "roles",
                description: "ex: @role_watcher | @useless_role | @idek",
                required: true
            },
            {
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: "role-labels",
                description: "ex: watch roles | 🚀 useless | ❓ idek",
                required: true
            },
            {
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: "description",
                description: "the description for your role select menu",
                maxLength: 2000
            }
        ]
    },
    exec: async (client: Client, interaction: CommandInteraction) => {
        await interaction.defer(64)

        let roles = interaction.data.options.getString("roles", true).split("|")
        let messages = interaction.data.options.getString("role-labels", true).split("|").map(m => m = m.trim());
        let description = interaction.data.options.getString("description");
        let msgEmojis: { id: string | null, name: string }[] = [];

        if (roles.length > 25) {
            return interaction.createFollowup({
                embeds: [{
                    description: `**${icons.Warning}** unable to create reaction roles \nthe maximum role choices is 25`,
                    color: colors.Warning
                }]
            })
        }

        if (roles.length != messages.length) {
            return interaction.createFollowup({
                embeds: [{
                    description: `**${icons.Warning}** unable to create reaction roles \nplease provide the equal amount of roles and messages`,
                    color: colors.Warning
                }]
            })
        }

        const invalidRole = {
            embeds: [{
                description: `**${icons.Warning} unable to create reaction roles** \nyou can only use valid roles like <@&${interaction.member?.roles[0]}>`,
                color: colors.Warning
            }],
        }

        for (let i = 0; i < roles.length; i++) {
            var role = roles[i]
            role = (role as string).trim()

            if (!/<@&[0-9]*>/g.test(role)) return interaction.createFollowup(invalidRole);

            role = await parseOptionValue(role)
            if (!interaction.guild?.roles.find(r => r.id == role)) return interaction.createFollowup(invalidRole);

            roles[i] = role;
        }

        for (let i = 0; i < messages.length; i++) {
            let msg = messages[i]
            if (msg.length > 80) return interaction.createFollowup({
                embeds: [{
                    description: `**${icons.Warning} unable to create reaction roles**
                    please make sure your descriptions (individually) are below 80 characters as discord doesnt allow me to do more
                    it was description number ${i + 1}`,
                    color: colors.Warning
                }]
            })
        }

        for (let i = 0; i < messages.length; i++) {
            var message = messages[i]
            var emoji = extractEmoji(message)

            if (emoji) {
                message = message.replace(/^(\p{Emoji})/u, "").replace(/^<:.{2,32}:[0-9]{18,}>/, "");
                if (/[0-9]*:[0-9]*/.test(emoji)) {
                    var parts = emoji.split(":")
                    msgEmojis.push({ id: parts[1], name: parts[0] })
                } else {
                    msgEmojis.push({ id: null, name: emoji })
                }
            } else {
                msgEmojis.push({ id: "1105133854064394371", name: "icon_notes" })
            }
            
            messages[i] = message;
        }

        let options: SelectOption[] = [];

        for (let i = 0; i < roles.length; i++) {
            options.push({ label: interaction.guild?.roles.find(r => r.id == roles[i])?.name as string, description: messages[i], value: roles[i], emoji: msgEmojis[i] })
        }

        await interaction.channel?.createMessage({
            embeds: [{
                description: `**${icons.Cogwheel} choose roles!** \n${description ?? `select which roles you want from the ${options.length} options`}
                
                ${options.map(o => `${o.emoji?.id ? `<:${o.emoji?.name}:${o.emoji?.id}>` : o.emoji?.name} <@&${o.value}>\n${icons.Reply}${o.description}\n`).toString().replaceAll("\n,", "\n")}
                `,
                color: colors.Neutral
            }],
            components: [{
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [{
                    type: Constants.ComponentTypes.STRING_SELECT,
                    customID: "reactionRoles",
                    options,
                    minValues: 1,
                    maxValues: options.length
                }]
            }]
        })

        interaction.deleteOriginal()
    }
}