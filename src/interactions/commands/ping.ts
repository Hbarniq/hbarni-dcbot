import { AnyCommandInteraction, ApplicationCommandTypes, Client } from 'oceanic.js';

import { colors } from '../../util/constants.js';
import { formatTime } from '../../util/util.js';

export default {
    command: {
        name: "ping",
        description: "pong!",
        type: ApplicationCommandTypes.CHAT_INPUT,
    },
    exec: async (client: Client, interaction: AnyCommandInteraction) => {
        var shard = "guildID" in interaction ? interaction.guild?.shard : client.shards.first();
        interaction.createMessage({
            embeds: [{
                title: "🏓 pong!",
                description: `latency: **${client.rest.handler.latencyRef.latency}ms** \ngateway: ${shard?.latency}ms \nuptime: ${await formatTime(Math.floor(process.uptime()))}`,
                color: colors.Neutral
            }]
        })
    }
}