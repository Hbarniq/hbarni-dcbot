const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  guildName: String,
  verification: {
    using: Boolean,
    verifiedRoleId: String,
    required: false,
  },
  welcome: {
    using: Boolean,
    welcomeChannel: String,
    required: false,
  },
  tickets: [
    {
      thread: String,
      creator: String,
    },
  ],
  reaction_roles: {
    roles: [
      {
        id: String,
        description: String,
        emoji: String,
      },
    ],
  },
  polls: [
    {
      id: String,
      data: {
        title: String,
        description: String
      },
      values: [
        {
          id: String,
          name: String,
          votes: Number,
        },
      ],
      voters: [String],
    },
  ],
  bridges: [
    {
      id: String,
      pending: Boolean,
      bridgedWith: {
        guildId: String,
        channelId: String
      }
    }
  ],
  serverip: { type: String, required: false },
});

module.exports = model("Guild", guildSchema, "guilds");
