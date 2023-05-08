import { Logger } from '../../util/logger.js';

export default {
    name: "err",
    exec: (err: any) => {
        Logger.error("database error!")
        Logger.debug(err)
    }
}