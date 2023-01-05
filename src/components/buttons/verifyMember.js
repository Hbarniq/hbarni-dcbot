const guild = require("../../schemas/guild");
module.exports = {
  data: {
    name: "verifyMember",
  },
  async run(client, interaction) {
    await interaction.defer(64);

    const accDate = (days) => {
      return Date.now() - interaction.member.createdAt < 1000 * 60 * 60 * 24 * days
    };

    if (
      accDate(2) | //account younger than 2 days
      new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(interaction.member.username) //username has url
    )
      {
      return interaction.createMessage({
        flags: 64,
        embed: {
          title: "oops... something went wrong",
          description:
            "Your account was deemed suspicious and did not pass verification\nIf you think this is wrong contact a moderator",
          color: 0xed4245,
        },
      });
    }

    const guildProfile = await guild.findOne({
      guildId: interaction.channel.guild.id,
    });

    const role = interaction.channel.guild.roles.get(
      guildProfile.verification.verifiedRoleId
    );
    const member = interaction.member;
    await interaction.member.addRole(role.id).catch(console.error);

    interaction.createMessage({
      embed: {
        color: 0x57f287,
        description: "You have been verified :D",
      },
    });
    if (!guildProfile.welcome.using) return;

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
      await member.user.dynamicAvatarURL("png")
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
      color: 0x5865f2,
      title: `Hi o/ ${member.username}`,
      image: { url: "attachment://backgroundimg.png" },
      description:
        "welcome to the server :D\ngo check out things like <#1036659271061999776>, <#1036334633333309440>",
    };
    const msg = await client.createMessage(
      guildProfile.welcome.welcomeChannel,
      {
        content: `<@${member.id}>`,
        embed: welcomeEmbed,
      },
      {
        file: await canvas.encode("png"),
        name: "backgroundimg.png",
      }
    );
    client.addMessageReaction(msg.channel.id, msg.id, "👋");
  },
};
