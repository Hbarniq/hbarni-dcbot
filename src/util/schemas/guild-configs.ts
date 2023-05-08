import { model, Schema } from 'mongoose';

export const GuildConfigSchema = new Schema({
  GuildData: {
      guildId: String,
      guildName: String,
  },
  Configs: {
    FeatureToggles: {
      Verification: Boolean,
      Welcome: Boolean
    },

    Options: {
      VerifiedRole: String,
      VerificationChannel: String,
      WelcomeAssignedRole: String,
      WelcomeMessageChannel: String,
      PingMinecraftServerIp: String
    }
  }
})

export const data = {
  ConfigToggles: [ "Verification", "Welcome" ],

  ConfigValues: [ "VerifiedRole", "VerificationChannel", "WelcomeAssignedRole", "PingMinecraftServerIp",],

  optionTypes: {
    VerifiedRole: "role id",
    VerificationChannel: "channel id",
    WelcomeAssignedRole: "role id",
    WelcomeMessageChannel: "channel id",
    PingMinecraftServerIp: "ip",
  } as any,
};

export default model("GuildConfig", GuildConfigSchema, "guild-configs");
