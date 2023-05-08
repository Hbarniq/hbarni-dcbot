import { Client, ModalSubmitInteraction, TextableChannel, Webhook } from 'oceanic.js';

import { dynamicAvatarURL } from '../../../util/util.js';

export default {
  customID: "embedModal",
  exec: async (client: Client, interaction: ModalSubmitInteraction) => {
    interaction.defer(64);

    const components = interaction.data.components;
    const embedTitle = components[0].components[0].value;
    const embedDescription = components[1].components[0].value;
    const embedColor = components[2].components[0].value;
    const embedImg = components[3].components[0].value;
    const embedThumbImg = components[4].components[0].value;

    const hex = /^#([0-9a-f]{3}){1,2}$/i;

    function validURL(str: string) {
      return str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
    }

    let embed = {
      description: embedDescription,
    };

    if (embedTitle) {
      embed = Object.assign({}, embed, { title: embedTitle });
    }

    if (embedColor && hex.test(embedColor)) {
      const resolvedColor = Number(embedColor.replace("#", "0x"));
      embed = Object.assign({}, embed, { color: resolvedColor });
    } else {
      embed = Object.assign({}, embed, { color: Number("0x2F3136") });
    }

    if (embedImg && validURL(embedImg)) {
      embed = Object.assign({}, embed, { image: { url: embedImg } });
    }

    if (embedThumbImg && validURL(embedThumbImg)) {
      embed = Object.assign({}, embed, { thumbnail: { url: embedThumbImg } });
    }

    if (interaction.channel instanceof TextableChannel) {
        let webhook: Webhook | undefined;
        webhook = (await interaction.guild?.getWebhooks())?.find((w) => w.name == "user-embeds");

        if (!webhook) {
            webhook = await interaction.channel.createWebhook({ name: "user-embeds", reason: `created for sending user embeds, this webhook will be reused` });
        } else if (webhook?.channel?.id != interaction.channel.id) {
            webhook = await webhook?.edit({ channelID: interaction.channel.id });
        }
        
        interaction.deleteOriginal()
        return await webhook?.execute({
            username: `${interaction.user.username}`,
            avatarURL: dynamicAvatarURL(interaction.user),
            embeds: [embed]
        });

    } else {
        embed = Object.assign({}, embed, { author: {
            name: `${interaction.user.username}`,
            iconURL: dynamicAvatarURL(interaction.user),
            url: `https://discord.com/users/${interaction.user.id}`,
          },
        })

        interaction.deleteOriginal()
        return await interaction.channel?.createMessage({
            embeds: [embed]
        });
    }
  },
};
