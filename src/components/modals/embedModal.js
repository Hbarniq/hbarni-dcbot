module.exports = {
  data: {
    name: "embedModal",
  },
  async run(client, interaction) {
    const components = interaction.data.components;
    const embedTitle = components[0].components[0].value;
    const embedDescription = components[1].components[0].value;
    const embedColor = components[2].components[0].value;
    const embedImg = components[3].components[0].value;
    const embedThumbImg = components[4].components[0].value;

    const hex = /^#([0-9a-f]{3}){1,2}$/i;

    function validURL(str) {
      return str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
    }
    
    let embed = {
      description: embedDescription,
      author: {
        name: `${interaction.member.username}`,
        icon_url: `${interaction.member.user.dynamicAvatarURL(
          interaction.member.user.avatar.startsWith("a_") ? "gif" : "png",
          128)}`,
        url: `https://discord.com/users/${interaction.member.id}`
      },
    };

    if (embedTitle) {
      embed = Object.assign({}, embed, { title: embedTitle });
    }

    if (embedColor && hex.test(embedColor)) {
      resolvedColor = Number(embedColor.replace("#", "0x"));
      embed = Object.assign({}, embed, { color: resolvedColor });
    } else {embed = Object.assign({}, embed, { color: Number("0x2F3136")})}

    if (embedImg && validURL(embedImg)) {
      embed = Object.assign({}, embed, { image: { url: embedImg } });
    }

    if (embedThumbImg && validURL(embedThumbImg)) {
      embed = Object.assign({}, embed, { thumbnail: { url: embedThumbImg } });
    }

    interaction.createMessage({
      embed: embed,
    });
  },
};
