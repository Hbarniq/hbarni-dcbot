import { Client, Guild } from 'oceanic.js';

import createGuildConfig from '../../util/createGuildConfig.js';
import { Logger } from '../../util/logger.js';

export default {
  name: "guildCreate",
  exec: async (client: Client, guild: Guild) => {
    return await createGuildConfig(guild.id, guild.name).catch(Logger.error)
  }
};
