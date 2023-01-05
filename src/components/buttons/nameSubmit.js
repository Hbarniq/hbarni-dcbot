const axios = require("axios");
module.exports = { // modals https://www.youtube.com/watch?v=Yu0jnPXKJSo (Eris doesnt have an official way of doin this)
    data: {
      name: "nameSubmit",
    },
    async run(client, interaction) {
        await axios({
            method: "POST",
            url: `https://discord.com/api/interactions/${interaction.id}/${interaction.token}/callback`,
            headers: {
              Authorization: `Bot ${client.token}`,
            },
            data: {
              type: 9, //modal type
              data: {
                title: "Submit your minecraft name!",
                custom_id: "nameModal",
                components: [
                  {
                    type: 1, //actionRowBuilder
                    components: [
                      {
                        type: 4, //modal text input
                        custom_id: "nameInput",
                        label: "your minecraft name",
                        placeholder: "Microsoft_sux956",
                        style: 1, // short
                        max_length: 50,
                        required: true,
                      },
                    ],
                  },
                ],
              },
            },
          });
    }
}