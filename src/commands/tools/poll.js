const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild");
exports.id = "1048593160886030385";
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
          value: "start",
        },
        {
          name: "end",
          value: "end",
        },
      ],
    },
    {
      type: 3,
      name: "options",
      description: "example: title | description",
      max_length: 200,
    },
    {
      type: 3,
      name: "choices",
      description: "example: option1 | option2 | option3",
    },
    {
      type: 3,
      name: "type",
      description: "the type of poll to send (defaults to simple)",
      choices: [
        {
          name: "simple (using reactions)",
          value: "simple",
        },
        {
          name: "complex (votes are hidden, has to be ended)",
          value: "complex",
        },
      ],
    },
    {
      type: 3,
      name: "id",
      description: "needed to conclude poll",
    },
  ],
  type: 1,
  defaultPermission: true,
  default_member_permissions: BigInt(1 << 13),
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  const action = interaction.data.options.find((o) => o.name == "action").value;
  const options = interaction.data.options.find((o) => o.name == "options");
  const choices = interaction.data.options.find((o) => o.name == "choices");
  let type = interaction.data.options.find((o) => o.name == "type");
  const poll_id = interaction.data.options.find((o) => o.name == "id");
  const guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });
  if (!type) {
    type = { value: "simple" }
  }

  switch (action) {
    case "start":
      if (!choices || !options) {
        return error('You need to specify "options" and "choices" when starting a poll', interaction);
      }

      const sepChoices = choices.value.split("|");
      if (sepChoices.length < 2 || sepChoices.length > 10) {
        return error("You need at least 2 choices and a maximum of 10, You need to seprate choices with a '|' character", interaction);
      }

      const sepOptions = options.value.split("|");
      if (sepOptions.length < 1 || sepOptions.length > 2) {
        return error("You need to define at least a title for your poll", interaction);
      }

      const _emoji = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿",];
      const emojis = [];
      let description = "";

      switch (type.value) {
        case "complex":
          let rows = [{
              type: 1,
              components: [],
            },];
          const values = [];

          for (let i = 0; i < sepChoices.length; i++) {
            let ind = Math.floor(i / 5);
            emojis.push(_emoji[i]);

            const button = {
              type: 2,
              custom_id: emojis[i],
              emoji: {
                id: null,
                name: emojis[i],
              },
              style: 2,
            };

            description += `\n${_emoji[i]} ${sepChoices[i]}`;

            rows[ind]
              ? rows[ind].components.push(button)
              : rows.push({
                  type: 1,
                  components: [button],
                });

            values.push({
              id: _emoji[i],
              name: sepChoices[i],
              votes: 0,
            });
          }

          const msg = await client.createMessage(interaction.channel.id, {
            embed: {
              title: `📊 ${sepOptions[0]}`,
              description: sepOptions[1] || "No description",
              color: 0x206694,
              footer: {
                text: `Waiting for poll_ID...`,
              },
            },
            components: rows,
          });

          await client.editMessage(interaction.channel.id, msg.id, {
            embed: {
              title: `📊 ${sepOptions[0]}`,
              description: `${
                sepOptions[1] || "No description"
              } \n${description}`,
              color: 0x206694,
              footer: {
                text: `poll_ID: ${msg.id}`,
              },
            },
          });

          guildProfile.polls.push({
            id: msg.id,
            data: {
              title: sepOptions[0],
              description: `${sepOptions[1] || "No description"}`,
            },
            values: values,
            voters: [],
          });
          guildProfile.save().catch();

          success("created poll!", interaction);

          break;

        case "simple":
          for (let i = 0; i < sepChoices.length; i++) {
            description += `\n${_emoji[i]} ${sepChoices[i]}\n`;
          }

          const simpleMsg = await client.createMessage(interaction.channel.id, {
            embed: {
              title: `📊 ${sepOptions[0]}`,
              description: `${
                sepOptions[1] || "No description"
              } \n${description}`,
              color: 0x206694,
            },
          });

          
          for (let i = 0; i < sepChoices.length; i++) {
            await simpleMsg.addReaction(_emoji[i]);
          }
          
          success("created poll!", interaction);
          break;

        default:
          break;
      }

      break;

    case "end":
      if (poll_id == undefined) {
        return error(
          'poll_ID not defined, please fill out the "id" option with the poll\'s id',
          interaction
        );
      }
      let poll = guildProfile.polls.find((p) => p.id == poll_id.value);
      if (poll == undefined) {
        return error(
          "Invalid poll_ID!\nthe poll's id is listed on the poll itself",
          interaction
        );
      }
      let end_values = "";
      poll.values.forEach(
        (p) => (end_values += `\n${p.id}: ${p.name}\nhad: ${p.votes} votes\n`)
      );

      client.editMessage(interaction.channel.id, poll_id.value, {
        embed: {
          title: `📊 ${poll.data.title} - ended.`,
          description: `${poll.data.description} \n${end_values}`,
          color: 0x206694,
          footer: { text: `concluded` },
          timestamp: new Date().toISOString(),
        },
        components: [],
      });

      await guildProfile.updateOne({ $pull: { polls: { id: poll_id.value } } });

      success("Ended poll and showed results!", interaction);
      break;

    default:
      break;
  }
};
