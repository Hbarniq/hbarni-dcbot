import mongoose from 'mongoose';
import { Client } from 'oceanic.js';

import handleEvents from '../handlers/events.js';
import handleInteractions from '../handlers/interactions.js';
import { Logger } from './logger.js';

export default async function startup(client: Client) {
    handleEvents(client)
    handleInteractions(client)
    await client.connect().catch(Logger.error);
    await mongoose.connect(process.env.DATABASE_TOKEN as string, { dbName: "data" }).catch(Logger.error);
}
