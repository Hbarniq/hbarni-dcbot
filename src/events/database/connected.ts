import { Logger } from '../../util/logger.js';

export default {
    name: "connected",
    exec: () => Logger.info("database connected")
}