const { Colors } = require("../../extra/colors");
const { error } = require("../../extra/replyFunc");

exports.command = {
    name: "quizletinfo",
    description: "gives info about a quizlet link in a message",
    options: [{
      type: 3,
      name: "message_id",
      description: "the message with the quizlet link",
      required: true
    }],
    type: 1,
};
exports.run = async (client, interaction) => {
    let msgId = await interaction.data.options.getString("message_id")
    let message = await client.rest.channels.getMessage(interaction.channel.id, msgId)
    
    let url = /^.*<?(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?>?$/gm.exec(message.content)
    if (!url) return error("unable to find quizlet link in message", interaction);
    url = url[0]

    // for searching through specific urls and replying with results
    if (url.includes("https://quizlet.com")) {
        const args = url.split("/")
        const res = await (await fetch(`https://quizlet.com/webapi/3.9/sets/${args[3]}`)).json().catch(err => {return;}); if (!res) return;
        const data = res.responses[0].models.set[0]
        interaction.createMessage({
            embeds: [{
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
            }],
            messageReference: { messageID: message.id }
        })
    } else {return error("unable to find quizlet link in message", interaction)}
}
