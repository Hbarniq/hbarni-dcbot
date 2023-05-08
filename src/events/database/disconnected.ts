import { Logger } from '../../util/logger.js';

export default {
    name: "disconnected",
    exec: () => Logger.warn("database disconnected!")
}