const { Colors } = require("../../extra/colors");

require("dotenv").config;
const { devs } = process.env;

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!devs.includes(message.author.id)) return;
    const [prefix, command, ...args] = message.content.split(" ");
    if (new RegExp(`^<@!?${client.user.id}>`).test(prefix)) {
      switch (command) {
        case "eval":
          const arg = args.join(" ")
          let res = "No resolution";
          try {
            res = await eval(`(async()=>{${arg.includes("return") ? "" : "return "}${arg}})()`);
            if (res != undefined) {
                if (res instanceof Promise) {
                    res = await res;
                }

                res = JSON.stringify(res, null, 4);
                res = res.replace(/(.{24}\..{6}\..{26})\w+/g, "data-hidden")
                res = res.replace(/(^.?mongodb\+srv:\/\/discordbot:.{36}\.mongodb\.net\/\?retryWrites=true&w=majority.?)/g, "data-hidden")
                
            }
          } catch (err) {
            res = err;
          }
          if (res == undefined) {
            res = new Error("Output could not be shown (out was undefined)")
          }

          let file;
          if (res.length >= 2000) {
            file = Buffer.from(res)
          }

          message.channel.createMessage({
            embeds: [
              {
                author: {
                  name: message.author.tag,
                  iconURL: message.author.avatarURL("png", 128),
                },
                color: res instanceof Error ? Colors.Error : Colors.Neutral,
                description: `
                📥 **Input**
                \`\`\`js\n${arg}\n\`\`\`

                📤 **Output**
                \`\`\`js\n${res.length >= 2000 ? "Output too large, see attachment" : res}\n\`\`\`
                `,
              },
            ],
            files: file ? [{
                contents: file,
                name: "output.txt"
            }] : []
          });

          break;

        default:
          break;
      }
    }
  },
};
