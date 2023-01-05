const { emojiRegex, discordEmojiRegex } = require("../../extra/emojiRegex");
const guild = require("../../schemas/guild");
exports.id = "1048593160886030381";
exports.command = {
  name: "reaction_roles",
  description: "for setting up reaction roles",
  options: [
    {
      type: 3,
      name: "action",
      description: "specifify what you want the command to do",
      required: true,
      choices: [
        {
          name: "add a role",
          value: "add_role",
        },
        {
          name: "send message",
          value: "send",
        },
        {
          name: "reset",
          value: "reset",
        },
      ],
    },
    {
      type: 8,
      name: "role",
      description: "a role to add to reaction roles",
    },
    {
      type: 3,
      name: "description",
      description: "the added role's description",
      max_length: 75,
    },
    {
      type: 3,
      name: "emoji",
      description: "the emoji to display for adding that role",
      max_length: 100,
    },
  ],
  type: 1,
  defaultPermission: true,
  default_member_permissions: 0x268435456,
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  const action = interaction.data.options.find((o) => o.name == "action").value;
  const added_role = interaction.data.options.find((o) => o.name == "role");
  const description = interaction.data.options.find((o) => o.name == "description");
  const emoji = interaction.data.options.find((o) => o.name == "emoji");

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
    case "add_role":
      if (added_role == undefined) {
        return error('You did not define a role... try adding one in "added_role"');
      }

      if (guildProfile.reaction_roles.roles.map((o) => o.id).includes(added_role.value)) {
        return error("You already defined this role :)");
      }

      if (interaction.channel.guild.roles.find((r) => r.id == added_role.value).managed) {
        return error("This role is bot only role!\nIt can't be added");
      }

      const roleEmoji =
        !emoji ||
        (!emojiRegex.test(emoji.value) && !discordEmojiRegex.test(emoji.value))
          ? "➖"
          : emoji.value;

      const role = {
        id: added_role.value,
        description: description ? description.value : "No description...",
        emoji: roleEmoji,
      };

      guildProfile.reaction_roles.roles.push(role);
      await guildProfile.save().catch(console.error);

      interaction.createMessage({
        flags: 64,
        embed: {
          title: "success!",
          description: `added the role to reaction roles!\nrole: <@&${
            role.id
          }>\ndescription: \`${role.description}\`\nemoji: ${
            role.emoji == "➖" ? "`No emoji set...`" : role.emoji
          }`,
          color: 0x57f287,
        },
      });

      break;

    case "send":
      if (
        guildProfile.reaction_roles == undefined ||
        guildProfile.reaction_roles.roles.length == 0
      ) {
        return error("You need to define options for roles before sending");
      }

      const role_options = [];
      const fields = [];
      const guildRoles = interaction.channel.guild.roles; // to cache roles

      guildProfile.reaction_roles.roles.forEach((r) => {
        const roleName = guildRoles.find((role) => role.id == r.id).name;

        const sentEmoji = emojiRegex.test(r.emoji)
          ? {
              id: null,
              name: r.emoji,
            }
          : discordEmojiRegex.test(r.emoji)
          ? {
              id: r.emoji.match(/([0-9]*>)/)[0].replace(">", ""),
              name: r.emoji.split(":")[1],
            }
          : {};

        role_options.push({
          label: roleName,
          description: r.description,
          emoji: sentEmoji,
          value: r.id,
        });

        fields.push({
          name: `${r.emoji} ${roleName}`,
          value: r.description,
        });
      });

      client.createMessage(interaction.channel.id, {
        embed: {
          title: "Select your roles below!",
          color: 0x206694,
          fields: fields,
        },
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: "reactionRoles",
                placeholder: "selected roles",
                min_values: 0,
                max_values: role_options.length,
                options: role_options,
              },
            ],
          },
        ],
      });

      interaction.createMessage({
        flags: 64,
        embed: {
          title: "success!",
          description: `created role selection prompt! ✅`,
          color: 0x57f287,
        },
      });

      break;

    case "reset":
      guildProfile.reaction_roles = undefined;
      await guildProfile.save().catch((_err) => {
        return error("Could not delete reaction roles data");
      });

      interaction.createMessage({
        flags: 64,
        embed: {
          title: "success!",
          description: `deleted reaction roles data... ✅`,
          color: 0x57f287,
        },
      });

      break;
    default:
      break;
  }
};
