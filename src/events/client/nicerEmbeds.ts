import { Client, Constants, EmbedOptions, Message, TextableChannel, Webhook } from "oceanic.js";
import { dynamicAvatarURL, getGuildData, getSelfWebhook } from "../../util/util.js";
import { colors } from "../../util/constants.js";

export default {
    name: "messageCreate",
    exec: async (client: Client, message: Message) => {
        if (!(message.channel instanceof TextableChannel)) return;
        
        var guildConfig = await getGuildData(message.guildID as string);
        if (!guildConfig?.Configs?.FeatureToggles?.NicerEmbeds || message.author.bot) return;

        let urls: any = message.content.match(/((?:https?|ftp):\/\/[\S]+)/g);
        if (!urls) return;
        urls = await removeDuplicates(urls);
        let embeds: EmbedOptions[] = [];
        

        for (const url of urls) {
            if (url.includes("https://quizlet.com")) {
              const args = url.split("/")
              const res = await fetch(`https://quizlet.com/webapi/3.9/sets/${args[3]}`).then(res => res.json()).catch(err => { return; });
              if (!res) return;
              const data = res.responses[0].models.set[0]
              embeds.push({
                author: {
                  name: "view on website",
                  url,
                  iconURL: "https://yt3.ggpht.com/2lfbQ5cIneWcMCMQV1ktvXJESV2HDF1qrzP2f1GQyfbuQmxpEEshl0INJd8XJbevA5oc9rc5SVw=s68-c-k-c0x00ffffff-no-rj"
                },
                title: data.title,
                description: `
                    description: ${data.description != "" ? data.description : "No description set.."}
                    terms: ${data.numTerms}
                    last modified: <t:${data.lastModified}:R>
                    images: ${data.hasImages}
                    translation: from \`${data.wordLang}\` to \`${data.defLang}\`
                    `,
                footer: {
                  text: `id: ${data.id}`
                },
                color: colors.Neutral
              })
            } else if (/https:\/\/discord\.gg\/([A-z0-9]*)/.test(url)) {
              const _invite = /https:\/\/discord\.gg\/([A-z0-9]*)/.exec(url)
              const invArgs = (_invite as any)[0].split("/")
              const invite = await fetch(`https://discord.com/api/invites/${invArgs[3]}`).then(res => res.json());
              embeds.push({
                title: invite.guild.name,
                description: `
                > description: ${!invite.guild.description ? "none" : invite.guild.description}
                expires: ${!invite.expires_at ? "never" : `in <t:${Date.parse(invite.expires_at) / 1000}:R>`}
                invite channel: <#${invite.channel.id}> ${invite.inviter ? `\ninvite by: <@${invite.inviter.id}>` : ""}
                code: ${invite.code}
                `,
                thumbnail: {
                  url: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}${invite.guild.icon.startsWith("a_") ? ".gif" : ".png"}?size=256`
                },
                color: colors.Neutral
              })
            } else return;
          }



        let webhook = await getSelfWebhook("user-embeds", message.channel, client);

        await webhook?.execute({
            username: `${message.author.username}`,
            avatarURL: dynamicAvatarURL(message.author),
            content: message.content.replaceAll(/((?:https?|ftp):\/\/[\S]+)/g, "<$1>"),
            flags: Constants.MessageFlags.SUPPRESS_NOTIFICATIONS,
            embeds
        });

        return message.delete();
    }
}

async function removeDuplicates(arr: Array<any>) {
    const cleaned: any[] = [];
    arr.forEach((e) => {
      if (cleaned.indexOf(e) === -1) {
        cleaned.push(e);
      }
    });
    return cleaned;
}
