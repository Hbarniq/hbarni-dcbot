const Oceanic = require("oceanic.js")
const { error } = require("../../extra/replyFunc");
module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) { 
        
    if (interaction instanceof Oceanic.CommandInteraction) {
    // Get the command name from the collection
    const command = client.commands.get(interaction.data.name);
    if (!command) {
        return interaction.createMessage({
            content: "I couldnt find that command... idk what u did?",
        });
    }
    try {
        await command.run(client, interaction);
    } catch (e) {
        await interaction.createMessage({
            embed: {
                title: "There was an error executing that command!",
                color: 0xed4245,
                description: `
                you should probably tell me: <@419838142510530572>
                \`\`\`yml\n${
                    e.message ? String(e.message) : String(e)
                }\n\`\`\``.substring(0, 1900),
            }
        }).catch(e => {});
        console.error(e);
    }
} else if (interaction instanceof Oceanic.ComponentInteraction) {
    if (interaction.data.componentType === 2) { // button component
        const button = client.buttons.get(interaction.data.customID)

        // pollButton
        if (["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"].includes(interaction.data.customID)) {
            return await client.buttons.get("pollButton").run(client, interaction).catch(err => error("Somehow I was unable to press that button right!", interaction));
        }
        // bridgeButton
        if (["bridge_accept", "bridge_decline"].includes(interaction.data.customID)) {
            return await client.buttons.get("bridgeButton").run(client, interaction).catch(err => {error("Somehow I was unable to press that button right!", interaction); console.log(err)});
        }

        if (!button) {
            return interaction.createMessage({
                content: "There is no code for this button???"
            })
        }
        try {
            await button.run(client, interaction);
        } catch (e) {
            await interaction.createMessage({
                embed: {
                    title: "Somehow I was unable to press that button right!",
                    color: 0xed4245,
                    description: `
                    you should probably tell me: <@419838142510530572>
                    \`\`\`yml\n${
                        e.message ? String(e.message) : String(e)
                    }\n\`\`\``.substring(0, 1900),
                }
            }).catch(e => {});
            console.error(e)
        }
    } else if (interaction.data.componentType === 3) {
        const selectMenu = client.selectMenus.get(interaction.data.customID)
        if (!selectMenu) {
            return interaction.createMessage({
                content: "There is no code for this selectMenu"
            })
        }
        try {
            await selectMenu.run(client, interaction)
        } catch (e) {
            await interaction.createMessage({
                embed: {
                    title: "I couldnt show you the result of that selection!",
                    color: 0xed4245,
                    description: `
                    you should probably tell me: <@419838142510530572>
                    \`\`\`yml\n${
                        e.message ? String(e.message) : String(e)
                    }\n\`\`\``.substring(0, 1900),
                }
            }).catch(e => {});
        }
    }
} else if (interaction instanceof Oceanic.ModalSubmitInteraction) { //representation of modalSubmit interaction because Eris doesnt support it
    const modal = client.modals.get(interaction.data.customID)
    if (!modal) {
        return interaction.createMessage({
            content: "There is no code for that modal"
        })
    }
    try {
        modal.run(client, interaction)
    } catch (e) {
        await interaction.createMessage({
            embed: {
                title: "There was an error showing you that modal!",
                color: 0xed4245,
                description: `
                you should probably tell me: <@419838142510530572>
                \`\`\`yml\n${
                    e.message ? String(e.message) : String(e)
                }\n\`\`\``.substring(0, 1900),
            }
        }).catch(e => {});
    }
}
}};