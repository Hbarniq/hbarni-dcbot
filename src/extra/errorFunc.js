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