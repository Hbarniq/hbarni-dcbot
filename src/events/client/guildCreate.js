const dataGuild = require("../../schemas/guild");
const mongoose = require("mongoose");
module.exports = {
  name: "guildCreate",
  async execute(guild, client) {
    const guildProfile = await new dataGuild({
      _id: mongoose.Types.ObjectId(),
      guildId: guild.id,
      guildName: guild.name,
    })
    await guildProfile.save().catch(console.error);
  },
};
// adds a new entry into the DB