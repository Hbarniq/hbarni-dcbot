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
          const _args = args.join(" ")
          let res = "No resolution";
          try {
            res = await eval(`(async()=>{return ${_args}})()`);
            if (res != undefined) {
                if (res instanceof Promise) {
                    res = await res;
                }
                
                res = JSON.stringify(res);
                res = res.replace(new RegExp(/(^Bot\s.{24}\..{6}\..{26})\w+/g), "Token-hidden")
                
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
                  name: message.author.name,
                  iconURL: message.author.avatarURL,
                },
                color: res instanceof Error ? Colors.Error : Colors.Neutral,
                description: `
                📥 **Input**
                \`\`\`js\n${args[0]}\n\`\`\`

                📤 **Output**
                \`\`\`js\n${res.length >= 2000 ? res.slice(0, 2000) + "\n\nOutput too large, see attachment" : res}\n\`\`\`
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
