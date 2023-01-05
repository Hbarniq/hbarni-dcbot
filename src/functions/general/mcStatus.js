const util = require("minecraft-server-util");
const guild = require("../../schemas/guild");
module.exports = (client) => {
  async function ping() {
    const guildProfile = await guild.findOne({
      guildId: "1036322425811513484",
    });

    const serverip = guildProfile.serverip;

    try {
      const response = await util.status(serverip, 25565, {
        timeout: 10000,
      });
      client.editMessage("1056639662199947314", "1056640786499903558", {
        content: `last updated: <t:${Math.floor(Date.now() / 1000)}:t>`,
        embed: {
          title: "Server status",
          description: "A server is online",
          color: 0x57f287,
          thumbnail: {
            url: "https://cdn.discordapp.com/avatars/419838142510530572/af980f65ee01db127c18dd4809742851.png?size=64",
          },
          fields: [
            { name: "Server Address", value: `||${serverip}||` },
            { name: "description of server", value: `${response.motd.clean}` },
            {
              name: "Online Players",
              value: `${response.players.online}/${response.players.max}`,
            },
          ],
        },
      });
    } catch (err) {
      await client.editMessage("1056639662199947314", "1056640786499903558", {
        content: `last updated: <t:${Math.floor(Date.now() / 1000)}:t>`,
        embed: {
          title: "Server status",
          description: "Currently no servers online",
          color: 0xed4245,
          thumbnail: {
            url: "https://cdn.discordapp.com/avatars/419838142510530572/af980f65ee01db127c18dd4809742851.png?size=64",
          },
          fields: [{ name: "Server Address", value: `||${serverip}||` }],
        },
      });
      return;
    }
  }

  client.mcStatus = async () => {
    setInterval(() => {
      ping();
    }, 60e3);
  };
};
