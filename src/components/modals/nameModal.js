module.exports = {
    data: {
      name: "nameModal",
    },
    async run(client, interaction) {
      await interaction.defer(64);
      const name = interaction.data.components[0].components[0].value
      
      await client.createMessage("1036352405199142982", {
        embed: {
            title: "New username found",
            description: `<@${interaction.member.id}>'s username is \`${name}\``,
            color: 0x57f287
        }
      })
      interaction.createMessage({
        embed: {
            title: "success!",
            description: `Name registered and sent to <@419838142510530572>\nyou should soon be whitelisted`,
            color: 0x57f287
        }
      })
    },
  };
  