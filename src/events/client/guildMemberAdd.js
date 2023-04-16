const { Colors } = require("../../extra/colors");
const guild = require("../../schemas/guild");
module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    let guildProfile = await guild.findOne({ guildId: member.guild.id });
    if (guildProfile.welcome != undefined && !guildProfile.verification.using) {
      if (guildProfile.welcome.role != undefined) {
        member.addRole(guildProfile.welcome.role, "given as join role")
      };
      const Canvas = require("@napi-rs/canvas");

      //shape the username depending on its scale
      const applyText = (canvas, text) => {
        const context = canvas.getContext("2d");
        let fontSize = 70;

        do {
          context.font = `${(fontSize -= 10)}px sans-serif`;
        } while (context.measureText(text).width > canvas.width - 300);

        return context.font;
      };

      const backgrounds = [
        "https://cdn.discordapp.com/attachments/884107536444297296/1036639380779044944/background.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050706731157692437/backgound2.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050709059759767592/background3.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050713022194270268/background4.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050713021850329139/background5.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050713021523169341/backgound6.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050713023226069033/backgound7.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050713021175054406/backgound8.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050743219987697744/background9.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050743220541333555/background10.png",
        "https://cdn.discordapp.com/attachments/1050691362128924743/1050743219601801318/background11.png",
      ];
      let random = undefined;
      random = Math.floor(Math.random() * backgrounds.length);
      // create welcome msg
      const canvas = Canvas.createCanvas(700, 250);
      const context = canvas.getContext("2d");
      const background = await Canvas.loadImage(backgrounds[random]);
      const avatar = await Canvas.loadImage(
        await member.user.avatarURL("png")
      );
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      context.font = "28px sans-serif";
      context.fillStyle = "#ffffff";
      context.fillText("Welcome", canvas.width / 2.5, canvas.height / 3.5);

      context.font = applyText(canvas, `${member.username}!`);
      context.fillStyle = "#ffffff";
      context.fillText(
        `${member.username}!`,
        canvas.width / 2.5,
        canvas.height / 1.8
      );

      // cut out the avatar's circle shape
      context.beginPath();
      context.arc(125, 125, 100, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      context.drawImage(avatar, 25, 25, 200, 200);

      welcomeEmbed = {
        color: Colors.Neutral,
        title: `Hi o/ ${member.username}`,
        image: { url: "attachment://backgroundimg.png" },
        description:
          `welcome to the server :D\n${member.guild.id == "1036322425811513484" ? "go check out things like <#1036659271061999776>, <#1036334633333309440>" : ""}`,
      };
      
      const welcomeChannel = await client.rest.channels.get(guildProfile.welcome.welcomeChannel)
      const msg = await welcomeChannel.createMessage({
        content: `<@${member.id}>`,
        embeds: [welcomeEmbed],
      },
      {
        file: await canvas.encode("png"),
        name: "backgroundimg.png",
      }
    );
      msg.createReaction("👋");
    } else return;
  },
};
// removes unused DB document
