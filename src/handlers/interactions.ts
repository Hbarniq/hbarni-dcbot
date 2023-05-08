import fs from 'fs/promises';
import {
    AnyCommandInteraction, Client, Collection, ComponentInteraction,
    CreateApplicationCommandOptions, ModalSubmitInteraction
} from 'oceanic.js';
import path from 'path';

import { Logger } from '../util/logger.js';

export default async function handleInteractions(client: Client) {
    const thisDir = path.dirname(new URL(import.meta.url).pathname)
    const interactionDirs = [
        path.join(thisDir, "../interactions/commands"),
        path.join(thisDir, "../interactions/components/buttons"),
        path.join(thisDir, "../interactions/components/selectmenus"),
        path.join(thisDir, "../interactions/components/modals"),
    ];

    for (const interactionDir of interactionDirs) {
        const interactionFiles = (await fs.readdir(interactionDir)).filter((file) => /\.[jt]s$/.test(file));

        for (const file of interactionFiles) {
            const interaction = await import(path.join(interactionDir, file));
            
            if (!interaction.default || !interaction.default.exec) return;

            if (interactionDir.endsWith("/commands")) {
                SavedInteractions.slashCommands.push(interaction.default.command);
                SavedInteractions.commands.set(interaction.default.command.name, interaction.default);
            } 
            else if (interactionDir.endsWith("/buttons")) { 
                SavedInteractions.buttons.set(interaction.default.customID, interaction.default);
            } else if (interactionDir.endsWith("/selectmenus")) { 
                SavedInteractions.selectMenus.set(interaction.default.customID, interaction.default);
            } else if (interactionDir.endsWith("/modals")) { 
                SavedInteractions.modals.set(interaction.default.customID, interaction.default);
            }
        }
    }

    client.once("ready", async () => {
        if (process.env.RELEASE == "true") {
            await client.application.bulkEditGlobalCommands(SavedInteractions.slashCommands).catch(Logger.error);
            Logger.debug(`reloaded ${SavedInteractions.slashCommands.length} commands globally`);
        } else {
            await client.application.bulkEditGuildCommands("652150784879886367", SavedInteractions.slashCommands).catch(Logger.error);
            Logger.debug(`reloaded ${SavedInteractions.slashCommands.length} commands locally`);
        }
    })

    Logger.debug(
      `loaded ${
        SavedInteractions.commands.size +
        SavedInteractions.buttons.size +
        SavedInteractions.selectMenus.size +
        SavedInteractions.modals.size
      } interactions`
    );
}

interface CommandFile {
    command: CreateApplicationCommandOptions;
    exec: (client: Client, interaction: AnyCommandInteraction) => Promise<void>;
}

interface ComponentFile {
    customID: string
    exec: (client: Client, interaction: ComponentInteraction) => Promise<void>
}

interface ModalFile {
    customID: string,
    exec: (Client: Client, interaction: ModalSubmitInteraction) => Promise<void>
}

export class SavedInteractions {
    static slashCommands: Array<CreateApplicationCommandOptions> = []
    static commands: Collection<string, CommandFile> = new Collection()
    static buttons: Collection<string, ComponentFile> = new Collection()
    static selectMenus: Collection<string, ComponentFile> = new Collection()
    static modals: Collection<string, ModalFile> = new Collection()
}