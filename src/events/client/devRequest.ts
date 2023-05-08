import { Client, Constants, Message } from 'oceanic.js';

import { colors, icons } from '../../util/constants.js';
import { formatTime } from '../../util/util.js';

export default {
  name: "messageCreate",
  exec: async (client: Client, message: Message) => {

    if (!process.env.DEVS?.includes(message.author.id)) return;
    
    const [prefix, command, ...args] = message.content.split(" ");
    if (!prefix.startsWith(`<@${client.user.id}>`)) return;

    switch (command) {
      case "eval":
        if (args.length == 0) return;
        let arg = args.join(" ");
        let flags: string[] = [];
        args.forEach((a) => {
          if (a.startsWith("-")) {
            arg = arg.replace(a, "");
            return flags.push(a.replace(/[-]{1,2}/g, ""));
          }
        });
        let res: any = "No resolution";
        try {
          res = await eval(
            `(async()=>{${arg.includes("return") ? "" : "return "}${arg}})()`
          );
          if (res != undefined) {
            if (res instanceof Promise) {
              res = res;
            }

            function replacer(key: any, value: any[]) {
              if (value instanceof Map) {
                return {
                  dataType: "Map",
                  value: Array.from(value.entries()),
                };
              } else {
                return value;
              }
            }

            res = JSON.stringify(res, replacer, 4);
            res = res.replace(/(.{24}\..{6}\..{26})\w+/g, "data-hidden");
            res = res.replace(/(^.?mongodb\+srv:\/\/discordbot:.{36}\.mongodb\.net\/\?retryWrites=true&w=majority.?)/g, "data-hidden");
          }
        } catch (err) {
          res = err;
        }
        if (res == undefined) {
          res = new Error("Output could not be shown (out was undefined)");
        }

        const useFile = ["f", "file"].some((e) => flags.includes(e));
        let file;
        if (res.length >= 2000 || useFile) {
          file = Buffer.from(res);
        }

        if (["d", "del", "delete"].some((e) => flags.includes(e))) {
          message.delete();
        }

        if (!["s", "silent"].some((e) => flags.includes(e))) {
          return message.channel?.createMessage({
            embeds: !useFile ? [
                  {
                    author: {
                      name: message.author.tag,
                      iconURL: message.author.avatarURL("png", 128),
                    },
                    color: res instanceof Error ? colors.Error : colors.Neutral,
                    description: `
📥 **Input**
\`\`\`js\n${arg}\n\`\`\`

📤 **Output**
\`\`\`js\n${res.length >= 2000 ? "Output too large, see attachment" : res}\n\`\`\`
                `
            }
        ] : [],
            files: file ? [
                  {
                    contents: file,
                    name: "output.txt",
                  },
                ] : [],
          });
        }

        break;

    case "exit":
        await message.channel?.createMessage({
            embeds: [{
              description: `**${icons.Yes} exited!** \nuptime: ${await formatTime(Math.floor(process.uptime()))}`,
              color: colors.Neutral
            }]
          })
        return process.exit(0);
        
    case "ahmsinfomenu":

      return await message.channel?.createMessage({
        embeds: [{
          title: "Get info about AHMS :D",
          description: "Choose what you want info about from the menu",
          image: {
            url: "https://cdn.discordapp.com/attachments/1050691362128924743/1050692389892796437/info.png",
          },
          color: colors.Neutral,
        }],
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                type: Constants.ComponentTypes.STRING_SELECT,
                customID: "ahmsInfoMenu",
                placeholder: "Select what you want info about",
                options: [
                  {
                    label: "faq",
                    description: "general information/faq about AHMS",
                    emoji: {
                      id: null,
                      name: "❓",
                    },
                    value: "infoEmbed",
                  },
                  {
                    label: "install guide",
                    description: "help with installing/updating the modpack",
                    emoji: {
                      id: null,
                      name: "📑",
                    },
                    value: "installEmbed",
                  },
                  {
                    label: "custom content help",
                    description:
                      "help with creating custom things like emotes or blocks",
                    emoji: {
                      id: null,
                      name: "🎨",
                    },
                    value: "customEmbed",
                  },
                ],
              },
            ],
          },
        ],
      });

      default:
        break;
    }
  },
};
