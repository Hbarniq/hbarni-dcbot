const axios = require('axios')
exports.id = "1048593160886030384"
exports.command = {
    name: "embed",
    description: "Creates a custom embed",
    type: 1,
    defaultPermission: true,
    default_member_permissions: BigInt(1 << 14), // embed links
  };
  exports.run = async (client, interaction) => {
    await axios({
        method: "POST",
        url: `https://discord.com/api/interactions/${interaction.id}/${interaction.token}/callback`,
        headers: {
          Authorization: `Bot ${client.token}`,
        },
        data: {
          type: 9, //modal type
          data: {
            title: "Embed contents",
            custom_id: "embedModal",
            components: [
              {
                type: 1, //actionRowBuilder
                components: [
                  {
                    type: 4, //modal text input
                    custom_id: "embedTitleInput",
                    label: "the title of your embed",
                    placeholder: "A short title",
                    style: 1, // short
                    max_length: 50,
                    required: false,
                  },
                ],
              },
              {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "embedDescInput",
                        label: "the description of your embed",
                        placeholder: "very fancy long description that can use normal discord formatting like spoilers",
                        style: 2, // paragraph
                        min_length: 1,
                        max_length: 4000,
                        required: true,
                    }
                ]
              },
              {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "embedColorInput",
                        label: "the color of your embed",
                        placeholder: 'accepts hex color. ex: "#7785cc" for discord\'s blue',
                        style: 1,
                        min_length: 3,
                        max_length: 17,
                        required: false
                    }
                ]
              },
              {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "embedImgInput",
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
                        custom_id: "embedThumbInput",
                        label: "a thumbnail (top right corner image)",
                        placeholder: "A link: https://cdn.discordapp.com/avatars/768875082705534977/b8228cc7501688e3b0a73f8cc7f040ad.png",
                        style: 1,
                        required: false
                    }
                ]
              }
            ],
          },
        },
      });
  };
  