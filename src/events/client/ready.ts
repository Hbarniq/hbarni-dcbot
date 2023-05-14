import { ActivityTypes, Client } from 'oceanic.js';

import createGuildConfig from '../../util/createGuildConfig.js';
import { Logger } from '../../util/logger.js';
import { getGuildData } from '../../util/util.js';

export default {
  name: "ready",
  once: true,
  exec: async (client: Client) => {
    Logger.info(`ready! logged in as ${client.user.tag}`)
    if (process.env.ACTIVITY != "false") {
      client.editStatus("online", [{ type: ActivityTypes.WATCHING, name: "/help" }]);
    }

    client.guilds.forEach(async (g) => {
      let guild = await getGuildData(g.id);
      if (!guild) {
        createGuildConfig(g.id, g.name);
      }
    })
  }
};
