const { Colors } = require("../../extra/colors");
<<<<<<< HEAD
const { fetch } = require("undici")
=======
const fetch = import("node-fetch")
>>>>>>> 5e33bc02d9a5ec58b82cad2a15091b43ba29d709
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
          let arg = args.join(" ")
          let flags = [];
          await args.forEach((a) => {
            a.startsWith()
            if (a.startsWith("-")) {
              arg = arg.replace(a, "")
              return flags.push(a.replace(/[-]{1,2}/g, ""))
            }
          })
          let res = "No resolution";
          try {
            res = await eval(`(async()=>{${arg.includes("return") ? "" : "return "}${arg}})()`);
            if (res != undefined) {
                if (res instanceof Promise) {
                    res = await res;
                }

                // convert Map/Collection to array so it can be parsed
                function replacer(key, value) {
                  if(value instanceof Map) {
                    return {
                      dataType: 'Map',
                      value: Array.from(value.entries()),
                    };
                  } else {
                    return value;
                  }
                }

                res = JSON.stringify(res, replacer, 4);
                res = res.replace(/(.{24}\..{6}\..{26})\w+/g, "data-hidden")
                res = res.replace(/(^.?mongodb\+srv:\/\/discordbot:.{36}\.mongodb\.net\/\?retryWrites=true&w=majority.?)/g, "data-hidden")
                
            }
          } catch (err) {
            res = err;
          }
          if (res == undefined) {
            res = new Error("Output could not be shown (out was undefined)")
          }

          const useFile = ["f", "file"].some((e) => flags.includes(e))
          let file;
          if (res.length >= 2000 || useFile) {
            file = Buffer.from(res)
          }

          if (["d", "del", "delete"].some((e) => flags.includes(e))) {
            message.delete()
          }

          if (!["s", "silent"].some((e) => flags.includes(e))) {
            message.channel.createMessage({
               embeds: !useFile ? [
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
              ] : [],
              files: file ? [{
                  contents: file,
                  name: "output.txt"
              }] : []
            });
          }

          break;

        default:
          break;
      }
    }
  },
};
