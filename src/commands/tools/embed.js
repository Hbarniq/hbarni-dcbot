
exports.command = {
    name: "embed",
    description: "Creates a custom embed",
    type: 1,
    defaultPermission: true,
    defaultMemberPermissions: BigInt(1 << 14), // embed links
  };
  exports.run = async (client, interaction) => {
    interaction.createModal({
      title: "Embed contents",
      customID: "embedModal",
      components: [
        {
          type: 1, //actionRowBuilder
          components: [
            {
              type: 4, //modal text input
              customID: "embedTitleInput",
              label: "the title of your embed",
              placeholder: "A short title",
              style: 1, // short
              maxLength: 50,
              required: false,
            },
          ],
        },
        {
          type: 1,
          components: [
              {
                  type: 4,
                  customID: "embedDescInput",
                  label: "the description of your embed",
                  placeholder: "very fancy long description that can use normal discord formatting like spoilers",
                  style: 2, // paragraph
                  minLength: 1,
                  maxLength: 4000,
                  required: true,
              }
          ]
        },
        {
          type: 1,
          components: [
              {
                  type: 4,
                  customID: "embedColorInput",
                  label: "the color of your embed",
                  placeholder: 'accepts hex color. ex: "#7785cc" for discord\'s blue',
                  style: 1,
                  minLength: 3,
                  maxLength: 17,
                  required: false
              }
          ]
        },
        {
          type: 1,
          components: [
              {
                  type: 4,
                  customID: "embedImgInput",
                  label: "an image for your embed",
                  placeholder: "A link: https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.png",
                  style: 1,
                  required: false
              }
          ]
        },
        {
          type: 1,
          components: [
              {
                  type: 4,
                  customID: "embedThumbInput",
                  label: "a thumbnail (top right corner image)",
                  placeholder: "A link: https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.png",
                  style: 1,
                  required: false
              }
          ]
        }
      ],
    })
  };
  