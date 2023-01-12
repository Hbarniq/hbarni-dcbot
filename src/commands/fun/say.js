exports.id = "1048593160886030376"
exports.command = {
    name: "say",
    description: "says what the user wants",
    options: [{
      type: 3,
      name: "message",
      description: "what you want the bot to say",
      required: true
    }],
    type: 1,
};
exports.run = async (client, interaction) => {
    await interaction.defer(64)
    checks = ["dumb", "buzi", "fulladj", "fuck", "kurva", "anyád", "baszódj", "gay", "fasz", "kibebaszott", "kibaszott", "boti egy", "szar", "ez a bot", "this bot", "dick", "cock" ,"swer", "ass", "cunt", "f@sz", "seiße", "i have", "i am", "készítőm", "creator", "@everyone", "@here", "cigány", "kuki", "kugi", "anal", "poop", "kill yourself", "nigger", "nigga"]
    let saymsg = interaction.data.options.raw[0].value
    if (!saymsg.match("^[a-zA-Z0-9_><@#áűúőöüóé ]*$")) {interaction.createMessage({ content: "You can't use special characters" }); return;}
    if (saymsg.length >= 100 | checks.some(v => saymsg.includes(v))) {
      interaction.deleteOriginal();
      interaction.channel.createMessage({ content: `${interaction.member.mention} no :)`})
      return;
    }
    interaction.deleteOriginal()
    interaction.channel.createMessage({
      content: `${saymsg}`
    })
}
