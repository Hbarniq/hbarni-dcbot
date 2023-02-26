const { Colors } = require("./colors");

exports.error = async (msg, interaction) => {
  const errEmbed = [{
    title: "oops... something went wrong",
    description: msg,
    color: Colors.Error,
  }]

  if (!interaction.acknowledged) {
    interaction.createMessage({flags: 64, embeds: errEmbed}).catch();
  } else interaction.createFollowup({flags: 64, embeds: errEmbed}).catch();
};
exports.success = async (msg, interaction) => {
  const successEmbed = [{
    title: "success!",
    description: msg,
    color: Colors.Success,
  }]

  if (!interaction.acknowledged) {
    return interaction.createMessage({flags: 64, embeds: successEmbed}).catch();
  } else return interaction.createFollowup({flags: 64, embeds: successEmbed}).catch();
};
