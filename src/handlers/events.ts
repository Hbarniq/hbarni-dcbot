import fs from 'fs/promises';
import mongoose, { Connection } from 'mongoose';
import { Client, ClientEvents } from 'oceanic.js';
import path from 'path';

import { Logger } from '../util/logger.js';

const { connection } = mongoose;

interface ClientEvent {
  name: keyof ClientEvents;
  once: boolean;
  exec(client: Client, ...args: any[]): Promise<void> | void;
}

interface DbEvent {
  name: string;
  once: boolean;
  exec(connection: Connection, ...args: any[]): Promise<void> | void;
}

export default async function handleEvents(client: Client) {
  const eventDirs = [
    path.join(path.dirname(new URL(import.meta.url).pathname), "../events/client"),
    path.join(path.dirname(new URL(import.meta.url).pathname), "../events/database")
  ];

  const clientEvents: ClientEvent[] = [];
  const dbEvents: DbEvent[] = [];

  for (const eventDir of eventDirs) {
    const eventFiles = (await fs.readdir(eventDir)).filter((file) => /\.[jt]s$/.test(file));
      
    for (const file of eventFiles) {
      const event = await import(path.join(eventDir, file));
      if (event.default && event.default.exec) {
        if (eventDir.endsWith("/client")) {
          clientEvents.push(event.default);
        } else if (eventDir.endsWith("/database")) {
          dbEvents.push(event.default);
        }
      }
    }
  }

  for (const event of clientEvents) {
    event.once
    ? client.once(event.name, (...args) => event.exec(client, ...args))
    : client.on(event.name, (...args) => event.exec(client, ...args));
  }

  for (const event of dbEvents) {
    event.once
    ? connection.once(event.name, (...args: any) => event.exec(connection, ...args))
    : connection.on(event.name, (...args: any) => event.exec(connection, ...args));
  }

  Logger.debug(`loaded ${clientEvents.length + dbEvents.length} events`)
}
