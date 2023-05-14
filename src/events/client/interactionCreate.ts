import {
    Client, CommandInteraction, ComponentInteraction, Constants, Interaction, ModalSubmitInteraction
} from 'oceanic.js';

import { SavedInteractions } from '../../handlers/interactions.js';
import { colors, icons } from '../../util/constants.js';
import { Logger } from '../../util/logger.js';

export default {
  name: "interactionCreate",
  exec: async (client: Client, interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
        const command = SavedInteractions.commands.get(interaction.data.name)
        if (!command) {
          Logger.warn(`${interaction.member?.tag} tried to execute an unknown command`)
          return interaction.createMessage({
            flags: 64,
            content: "I could not find out how to execute that command",
          }).catch(Logger.error)
        };

        return await command.exec(client, interaction).catch(async (err) => await returnError("Error occured while executing command", err, interaction));
    } else if (interaction instanceof ComponentInteraction) {
      if (interaction.data.componentType == Constants.ComponentTypes.BUTTON) {

        const component = SavedInteractions.buttons.get(interaction.data.customID)
        if (!component) {
          Logger.warn(`${interaction.member?.tag} tried to execute an unknown button`);
          return interaction.createMessage({
            flags: 64,
            content: "I could not find out how to execute that button press"
          })
        }

        component.exec(client, interaction).catch(async (err) => await returnError("Error occured while executing button press", err, interaction));

      } else { //assume selectmenu

        const component = SavedInteractions.selectMenus.get(interaction.data.customID)
        if (!component) {
          Logger.warn(`${interaction.member?.tag} tried to execute an unknown selectmenu`);
          return interaction.createMessage({
            flags: 64,
            content: "I could not find out how to execute that selection"
          })
        }

        component.exec(client, interaction).catch(async (err) => await returnError("Error occured while executing selection", err, interaction));

      }
    } else if (interaction instanceof ModalSubmitInteraction) {

      const modal = SavedInteractions.modals.get(interaction.data.customID)
      if (!modal) {
        Logger.warn(`${interaction.member?.tag} tried to execute an unknown modal`);
        return interaction.createMessage({
          flags: 64,
          content: "I could not find out how to execute that modal response"
        })
      }

      modal.exec(client, interaction).catch(async (err) => await returnError("Error occured while executing modal response", err, interaction));

    }
  }
};

async function returnError(message: string, err: any, interaction: CommandInteraction | ComponentInteraction | ModalSubmitInteraction,) {
  Logger.error(`error while executing ${interaction instanceof CommandInteraction ? interaction.data.name : interaction.data.customID}`)
  console.log(err)

  const embeds = [{
    title: `${icons.Error} ${message}`,
    description: "this error has been logged!",
    color: colors.Error
  }]

  try {
    if (interaction.acknowledged) {
      return interaction.createFollowup({ flags: 64, embeds })
    } else {
      return interaction.createMessage({ flags: 64, embeds })
    }
  } catch (err) {
    console.error(err)
  }
}
