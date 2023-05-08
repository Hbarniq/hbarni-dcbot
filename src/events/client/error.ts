import { Client } from 'oceanic.js';

import { Logger } from '../../util/logger.js';

export default {
  name: "error",
  exec: async (client: Client, err: any) => {
    return Logger.error(err)
  }
};
