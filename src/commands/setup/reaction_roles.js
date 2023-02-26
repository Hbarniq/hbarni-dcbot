const { Colors } = require("../../extra/colors");
const { emojiRegex, discordEmojiRegex } = require("../../extra/emojiRegex");
const { error, success } = require("../../extra/replyFunc");
const guild = require("../../schemas/guild");

exports.command = {
  name: "reaction_roles",
  description: "for setting up reaction roles",
  options: [
    {
      type: 3,
      name: "action",
      description: "specify what you want the command to do",
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
      maxLength: 75,
    },
    {
      type: 3,
      name: "emoji",
      description: "the emoji to display for adding that role",
      maxLength: 100,
    },
  ],
  type: 1,
  defaultPermission: true,
  defaultMemberPermissions: BigInt(1 << 28),
};
exports.run = async (client, interaction) => {
  const action = interaction.data.options.getString("action", true);
  const added_role = interaction.data.options.getRole("role");
  const description = interaction.data.options.getString("description");
  const emoji = interaction.data.options.getString("emoji");

  const guildProfile = await guild.findOne({
    guildId: interaction.channel.guild.id,
  });

  switch (action) {
    case "add_role":
      if (added_role == undefined) {
        return error('You did not define a role... try adding one in "added_role"', interaction);
      }

      if (guildProfile.reaction_roles.roles.map((o) => o.id).includes(added_role.id)) {
        return error("You already defined this role :)", interaction);
      }

      if (added_role.managed) {
        return error("This role is bot only role!\nIt can't be added", interaction);
      }

      const roleEmoji =
        !emoji ||
        (!emojiRegex.test(emoji) && !discordEmojiRegex.test(emoji))
          ? "➖"
          : emoji;

      const role = {
        id: added_role.id,
        description: description ? description : "No description...",
        emoji: roleEmoji,
      };

      guildProfile.reaction_roles.roles.push(role);
      await guildProfile.save().catch(console.error);

      success(`added the role to reaction roles!\nrole: <@&${role.id}>\ndescription: \`${role.description}\`\nemoji: ${role.emoji == "➖" ? "`No emoji set...`" : role.emoji}`, interaction)

      break;

    case "send":
      if (
        guildProfile.reaction_roles == undefined ||
        guildProfile.reaction_roles.roles.length == 0
      ) {
        return error("You need to define options for roles before sending", interaction);
      }

      const role_options = [];
      const fields = [];
      const guildRoles = interaction.guild.roles;

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
        
        const channelId = /<(#[0-9])\w+>/g
        let cleanDesc = ""

        if (r.description.search(channelId) != -1) {
          const clean = r.description.match(channelId)[0]
          cleanDesc = r.description.replace(clean, interaction.channel.guild.channels.find((c) => c.id == clean.replace(/<|#|>/g, "")).name)
        }

        role_options.push({
          label: roleName,
          description: cleanDesc != "" ? cleanDesc : r.description,
          emoji: sentEmoji,
          value: r.id,
        });

        fields.push({
          name: `${r.emoji} ${roleName}`,
          value: r.description,
        });
      });

      interaction.channel.createMessage({
        embeds: [{
          title: "Select your roles below!",
          color: Colors.Neutral,
          fields: fields,
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                customID: "reactionRoles",
                placeholder: "selected roles",
                minValues: 0,
                maxValues: role_options.length,
                options: role_options,
              },
            ],
          },
        ],
      });

      success(`created role selection prompt!`, interaction)

      break;

    case "reset":
      guildProfile.reaction_roles = undefined;
      await guildProfile.save().catch((_err) => {
        return error("Could not delete reaction roles data", interaction);
      });

      success(`deleted reaction roles data... ✅`, interaction)

      break;
    default:
      break;
  }
};
