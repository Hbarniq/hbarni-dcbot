import { Logger } from './logger.js';
import guildConfigs from './schemas/guild-configs.js';

export default async function createGuildConfig(guildId: string, guildName: string) {
  try {
    const newConfig = new guildConfigs({
      GuildData: {
        guildId: guildId,
        guildName: guildName,
      },
      Configs: {
        FeatureToggles: {
          Verification: false,
          WelcomeMessages: false
        },
    
        Options: {
          VerifiedRole: undefined,
          VerificationChannel: undefined,
          WelcomeAssignedRole: undefined,
          WelcomeMessageChannel: undefined,
          PingMinecraftServerIp: undefined
        }
      }
    });
    
    await newConfig.save();
    Logger.debug(`Succesfully registered new Guild: ${guildName}`)
  } catch (error) {
    Logger.error(`Error creating new guild config: ${error}`)
  }
}
