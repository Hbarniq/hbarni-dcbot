exports.id = "1050700126374613033"
exports.command = {
  name: "roadmap",
  description:
    "a roadmap updating to things I (Hbarni) am working on currently",
  defaultPermission: true,
};
exports.run = async (client, interaction) => {
  await interaction.defer(64);
  await interaction.createMessage({
    embed: {
      title: "roadmap",
      description: `
**discord bot**
\`\`\`diff
+ make a database for the bot so it can be used for anything by anyone
- /settings command to toggle bot commands/features
\`\`\`

**AHMS modpack/server**
\`\`\`diff
+ fix all the little annoyances with spawn protection
+ fix carrying blocks that should not be carried
- change F3 server branding
- fix limbo system\`\`\`
`,
      color: 0x5865f2,
    },
  });
};
