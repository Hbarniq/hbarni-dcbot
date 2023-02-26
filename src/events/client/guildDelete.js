const dataGuild = require("../../schemas/guild");
module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    await dataGuild.findOneAndDelete({
        guildId: guild.id,
      }).catch(console.error)
  },
};
// removes unused DB document