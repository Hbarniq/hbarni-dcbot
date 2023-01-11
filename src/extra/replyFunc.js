exports.error = async (msg, interaction) => {
  return await interaction.createMessage({
    flags: 64,
    embed: {
      title: "oops... something went wrong",
      description: msg,
      color: 0xed4245,
    },
  });
};
exports.success = async (msg, interaction) => {
  interaction.createMessage({
    flags: 64,
    embed: {
      title: "success!",
      description: msg,
      color: 0x57f287,
    },
  });
};
