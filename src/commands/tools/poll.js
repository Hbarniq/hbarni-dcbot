const guild = require("../../schemas/guild");
exports.id = "1048593160886030385"
exports.command = {
  name: "poll",
  description: "for running polls",
  options: [
    {
        type: 3,
        name: "action",
        description: "specify what you want the command to do",
        required: true,
        choices: [
            {
                name: "start",
                value: "start"
            },
            {
                name: "end",
                value: "end"
            }
        ]
    },
    {
        type: 3,
        name: "options",
        description: "example: title | description"
    },
    {
        type: 3,
        name: "choices",
        description: 'example: option1 | option2 | option3',
    },
    {
        type: 3,
        name: "id",
        description: "needed to conclude poll"
    }
  ],
  type: 1,
  defaultPermission: true,
  default_member_permissions: 0x268435456
};
exports.run = async (client, interaction) => {
    await interaction.defer(64)
    const action = interaction.data.options.find((o) => o.name == "action").value;
    const options = interaction.data.options.find((o) => o.name == "options");
    const choices = interaction.data.options.find((o) => o.name == "choices");
    const poll_id = interaction.data.options.find((o) => o.name == "id")
    const guildProfile = await guild.findOne({
        guildId: interaction.channel.guild.id,
      });

    const error = async (msg) => {
      return await interaction.createMessage({
        flags: 64,
        embed: {
          title: "oops... something went wrong",
          description: msg,
          color: 0xed4245,
        },
      });
    };

    switch (action) {
        case "start":
            if (!choices || !options) {
                return error('You need to specify "options" and "choices" when starting a poll')
            }

            const sepChoices = choices.value.split("|")
            if(sepChoices.length < 2 || sepChoices.length > 25) {
                return error("You need at least 2 choices and a maximum of 25, You need to seprate choices with a '|' character")
            }

            const sepOptions = options.value.split("|")
            if (sepOptions.length < 1 || sepOptions.length > 2) {
                return error("You need to define at least a title for your poll")
            }

            let rows = [{
                type: 1,
                components: []
            }]
            const _emoji = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"]
            const emojis = []
            const values = []
            let description = ""

            for (let i = 0; i < sepChoices.length; i++) {
                let ind = Math.floor(i / 5);
                emojis.push(_emoji[i]);

                const button = {
                    type: 2,
                    custom_id: emojis[i],
                    emoji: {
                        id: null,
                        name: emojis[i]
                    },
                    style: 2
                };

                description += `\n${_emoji[i]} ${sepChoices[i]}`

                rows[ind] ? rows[ind].components.push(button) : rows.push({
                    type: 1,
                    components: [button]
                })

                values.push({
                    id: _emoji[i],
                    votes: 0
                })
            }

            const msg = await client.createMessage(interaction.channel.id, {
                embed: {
                    title: sepOptions[0],
                    description: sepOptions[1] || "No description",
                    color: 0x206694,
                    footer: {
                        text: `Waiting for poll_ID...`
                    },
                },
                components: rows
            })

            await client.editMessage(interaction.channel.id, msg.id, {
                embed: {
                    title: sepOptions[0],
                    description: `${sepOptions[1] || "No description"}\n${description}`,
                    color: 0x206694,
                    footer: {
                        text: `poll_ID: ${msg.id}`
                    },
                }
            })

            guildProfile.polls.push({
                id: msg.id,
                values: values,
                voters: []
            })
            guildProfile.save().catch()

            interaction.createMessage({
                flags: 64,
                embed: {
                  title: "success!",
                  description: `created poll!`,
                  color: 0x57f287,
                },
              });

            break;

        case "end":

            guildProfile.polls = undefined
            guildProfile.save().catch()

            break;
    
        default:
            break;
    }
};
