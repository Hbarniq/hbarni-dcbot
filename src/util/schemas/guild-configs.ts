import { model, Schema } from 'mongoose';

export const GuildConfigSchema = new Schema({
  GuildData: {
      guildId: String,
      guildName: String,
  },
  Configs: {
    FeatureToggles: {
      Verification: Boolean,
      Welcome: Boolean,
      NicerEmbeds: Boolean
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
  ConfigToggles: [ "Verification", "Welcome", "NicerEmbeds" ],

  ConfigValues: [ "VerifiedRole", "VerificationChannel", "WelcomeAssignedRole", "WelcomeMessageChannel", "PingMinecraftServerIp"],

  optionTypes: {
    VerifiedRole: "role id",
    VerificationChannel: "channel id",
    WelcomeAssignedRole: "role id",
    WelcomeMessageChannel: "channel id",
    PingMinecraftServerIp: "ip",
  } as any,
};

export default model("GuildConfig", GuildConfigSchema, "guild-configs");
