const { Colors } = require("../../extra/colors");
const { fetch } = require("undici");
const { removeDuplicates } = require("../../extra/removeDuplicates");
const urlRegex = /((?:https?|ftp):\/\/[\S]+)/g;
module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    let urls = await message.content.match(urlRegex);
    if (!urls) return;
    urls = await removeDuplicates(urls);
    let embeds = [];

    for (const url of urls) {
      if (url.includes("https://quizlet.com")) {
        const args = url.split("/")
        const res = await fetch(`https://quizlet.com/webapi/3.9/sets/${args[3]}`).then(res => res.json()).catch(err => { return; });
        if (!res) return;
        const data = res.responses[0].models.set[0]
        embeds.push({
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
          color: Colors.Neutral
        })
      } else if (/https:\/\/discord\.gg\/([A-z0-9]*)/.test(url)) {
        const _invite = /https:\/\/discord\.gg\/([A-z0-9]*)/.exec(url)
        const invArgs = _invite[0].split("/")
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
          color: Colors.Neutral
        })
      }
    }

    message.channel.createMessage({
      embeds,
      messageReference: { messageID: message.id }
    });
  },
};