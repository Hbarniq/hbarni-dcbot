module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.editStatus("online", { name: "/help", type: 3 });
    console.log(
      `Ready! logged in as: ${client.user.tag}, serving ${(client.guilds.map(g => g)).length} guilds`
    );
  },
};
