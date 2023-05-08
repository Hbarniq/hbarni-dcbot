import { Client, CommandInteraction, Constants } from 'oceanic.js';

import { colors, icons } from '../../util/constants.js';

export default {
    command: {
        name: "poll",
        description: "create a poll",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        options: [
            {
                name: "name",
                description: "the name of your poll",
                type: Constants.ApplicationCommandOptionTypes.STRING,
                maxLength: 75,
                required: true
            },
            {
                name: "options",
                description: "ex: option1 | 🚀option 2 with emoji, (max 10)",
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: "description",
                description: "a description of the poll",
                maxLength: 2000,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    },
    exec: async (client: Client, interaction: CommandInteraction) => {
        interaction.defer(64)
        const pollName = interaction.data.options.getString("name", true);
        const pollDesc = interaction.data.options.getString("description");
        const options = interaction.data.options.getString("options", true)
        let optionEmojis: string[] = [];
        let finalArray: string[] = [];
          
        const emojis = ["\u{0031}\u{20E3}", "\u{0032}\u{20E3}", "\u{0033}\u{20E3}", "\u{0034}\u{20E3}", "\u{0035}\u{20E3}", "\u{0036}\u{20E3}", "\u{0037}\u{20E3}", "\u{0038}\u{20E3}", "\u{0039}\u{20E3}", "\u{0031}\u{0030}\u{20E3}"];

        let splitOptions = options.split("|");
        if (splitOptions.length > 10) {
            return interaction.createFollowup({
                embeds: [{
                    description: `${icons.Warning} invalid options \nyou can only provide 10 options max`,
                    color: colors.Warning
                }]
            })
        }

        for (let i = 0; i < splitOptions.length; i++) {
            const option = splitOptions[i].trim()
            if (!(option == "")) {
                var emoji = extractEmoji(option)
    
                if (emoji) {
                    finalArray.push(`${option}\n\n`)
                    optionEmojis.push(emoji)
                } else {
                    finalArray.push(`${emojis[i]} ${option}\n\n`)
                    optionEmojis.push(emojis[i])
                }
            } else {
                for (let i = emojis.length - 1; i > 0; i--) {
                    emojis[i] = emojis[i - 1];
                  }
                  
                emojis[i] = emojis[i + 1]
            }
        }

        const msg = await interaction.channel?.createMessage({
            embeds: [{
                title: pollName,
                description: `${pollDesc ?? ""}\n\n${finalArray.toString().replaceAll(",", "")}`,
                footer: {
                    text: `by: ${interaction.member?.nick ?? interaction.user.username}`,
                },
                color: colors.Neutral
            }]
        })

        optionEmojis.forEach(async e => {
            await msg?.createReaction(`${e}`).catch(e => {})
        })

        interaction.deleteOriginal();
    }
}

export function extractEmoji(string: string) {
    const emoji = string.match(/^(\p{Emoji})/u);
    if (emoji) {
        return emoji[0]
    }
    
    const customEmoji = string.match(/^<:.{2,32}:[0-9]{18,}>/);
    return customEmoji ? customEmoji[0].substring(2, customEmoji[0].length - 1) : null;
}