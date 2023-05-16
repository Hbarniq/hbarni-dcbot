import { AnyCommandInteraction, Client, Constants } from 'oceanic.js';
import { colors, icons } from '../../util/constants.js';

export default {
  command: {
    name: "embed",
    description: "Creates a custom embed!",
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    defaultMemberPermissions: Constants.Permissions.EMBED_LINKS
  },
  exec: async (client: Client, interaction: AnyCommandInteraction) => {
    await interaction.createModal({
      title: "Embed contents",
      customID: "embedModal",
      components: [
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "embedTitleInput",
              label: "the title of your embed",
              placeholder: "A short title",
              style: Constants.TextInputStyles.SHORT,
              maxLength: 50,
              required: false,
            },
          ],
        },
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "embedDescInput",
              label: "the description of your embed",
              placeholder:
                "very fancy long description that can use normal discord formatting like spoilers",
              style: Constants.TextInputStyles.PARAGRAPH,
              minLength: 1,
              maxLength: 4000,
              required: true,
            },
          ],
        },
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "embedColorInput",
              label: "the color of your embed",
              placeholder:
                'accepts hex color. ex: "#7785cc" for discord\'s blue',
              style: Constants.TextInputStyles.SHORT,
              minLength: 3,
              maxLength: 17,
              required: false,
            },
          ],
        },
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "embedImgInput",
              label: "an image for your embed",
              placeholder:
                "A link: https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.png",
              style: Constants.TextInputStyles.SHORT,
              required: false,
            },
          ],
        },
        {
          type: Constants.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "embedThumbInput",
              label: "a thumbnail (top right corner image)",
              placeholder:
                "A link: https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.png",
              style: Constants.TextInputStyles.SHORT,
              required: false,
            },
          ],
        },
      ],
    }).catch(_ => {
      return interaction.createMessage({
        embeds: [{
          description: `**${icons.Warning} modal creation rejected!** \nI was unable to create the modal for whatever reason.. try again!`,
          color: colors.Warning
        }]
      })
    });
  },
};
