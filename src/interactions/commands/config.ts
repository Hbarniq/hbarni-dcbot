import { Client, CommandInteraction, Constants } from 'oceanic.js';

import { checkValidId, initFeature, parseOptionValue } from '../../util/configUtil.js';
import { colors, icons } from '../../util/constants.js';
import guildConfigs, { data } from '../../util/schemas/guild-configs.js';

export default {
    command: {
        name: "config",
        description: "edit configs",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        defaultMemberPermissions: Constants.Permissions.ADMINISTRATOR,
        options: [
            {
                name: "toggle",
                description: "toggle a feature",
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                    {
                        name: "option",
                        description: "The feature you want to toggle",
                        type: Constants.ApplicationCommandOptionTypes.STRING,
                        choices: data.ConfigToggles.map((name) => ({ name: name, value: name })),
                        required: true
                    }
                ]
            },
            {
                name: "set",
                description: "set a value for a feature",
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                    {
                        name: "option",
                        description: "the option you want to set a value for",
                        type: Constants.ApplicationCommandOptionTypes.STRING,
                        choices: data.ConfigValues.map((name) => ({ name: name, value: name })),
                        required: true
                    },
                    {
                        name: "value",
                        description: "ex: @role, #channel.. or 918265918256 (id)",
                        type: Constants.ApplicationCommandOptionTypes.STRING,
                        required: true
                    }
                ]
            },
            {
                name: "check",
                description: "get/check the entire config",
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
            },
            {
                name: "delete",
                description: "delete a value from the config",
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                    {
                        name: "option",
                        description: "the option you want to delete the value of",
                        type: Constants.ApplicationCommandOptionTypes.STRING,
                        choices: data.ConfigValues.map((name) => ({ name: name, value: name })),
                        required: true
                    }
                ]
            }
        ]
    },
    exec: async (client: Client, interaction: CommandInteraction) => {
        await interaction.defer(64)
        const guildConfig: any = await guildConfigs.findOne({ "GuildData.guildId": interaction.guild?.id });

        switch (interaction.data.options.getSubCommand()?.[0]) {
            case "toggle":
                var option = interaction.data.options.getStringOption("option", true)?.value;

                guildConfig.Configs.FeatureToggles[option] = !guildConfig.Configs.FeatureToggles[option];
                await guildConfig.save();

                var embeds = [{
                    title: `${icons.Yes} config updated!`,
                    description: `**${option}** is now **${guildConfig.Configs.FeatureToggles[option] ? "enabled" : "disabled"}**`,
                    color: colors.Neutral as number
                }]

                if (guildConfig.Configs.FeatureToggles[option]) {
                    var initialized = await initFeature(option, interaction, guildConfig)
    
                    if (initialized != undefined && !initialized) {
                        embeds.push({
                            title: `${icons.Warning} warning!`,
                            description: `This feature requires more configuration to work \nsee the options with **/config check**`,
                            color: colors.Warning,
                        })
                    }
                }

                return interaction.createFollowup({
                    flags: 64,
                    embeds
                })

            
            case "set":
                var option = interaction.data.options.getStringOption("option", true)?.value;
                var value = await parseOptionValue(interaction.data.options.getStringOption("value", true)?.value.trim());

                if (!(await checkValidId(value, data.optionTypes[option], interaction))) {
                    return interaction.createFollowup({
                        flags: 64,
                        embeds: [{
                            title: `${icons.Warning} failed to update config!`,
                            description: `the value you provided was invalid \n**${option} requires a valid ${data.optionTypes[option]} \nor tag like: ${
                                data.optionTypes[option] == "role id" ? interaction.member?.roles.length ? `<@&${interaction.member?.roles[0]}> for example` : "@role"
                                : data.optionTypes[option] == "channel id" ? `<#${interaction.channelID}>`
                                : "@whatever"}**`,
                            color: colors.Warning
                        }]
                    })
                }

                guildConfig.Configs.Options[option as string] = value;
                await guildConfig.save();

                initFeature(option, interaction, guildConfig)

                return interaction.createFollowup({
                    flags: 64,
                    embeds: [{
                        title: `${icons.Yes} config updated!`,
                        description: `**${option}** has been set to: ${
                            data.optionTypes[option] == "channel id" ? `<#${value}>` :
                            data.optionTypes[option] == "role id" ? `<@&${value}>` : `"${value}"`
                        }`,
                        color: colors.Neutral
                    }]
                })

            
            case "delete":
                var option = interaction.data.options.getStringOption("option", true)?.value;

                if (!guildConfig.Configs.Options[option as string]) {
                    return interaction.createFollowup({
                        flags: 64,
                        embeds: [{
                            title: `${icons.Warning} config unchanged!`,
                            description: `**${option}** was already undefined \nyou can look at the current config with **/config check**`,
                            color: colors.Warning
                        }]
                    })
                }

                guildConfig.Configs.Options[option as string] = undefined;
                await guildConfig.save();

                return interaction.createFollowup({
                    flags: 64,
                    embeds: [{
                        title: `${icons.Yes} config updated!`,
                        description: `**${option}** has been deleted`,
                        color: colors.Neutral
                    }]
                })

            case "check":
                var toggles = guildConfig.Configs.FeatureToggles
                var options = guildConfig.Configs.Options

                return interaction.createFollowup({ 
                    embeds: [{
                        description: `${icons.Cogwheel} **Config**`,
                        color: colors.Neutral,
                        fields: [
                            { name: "Verification", value: toggles.Verification ? icons.Yes : icons.No, inline: true},
                            { name: "Verification Channel", value: options.VerificationChannel ? `<#${options.VerificationChannel}>` : "none", inline: true},
                            { name: "Verified Role", value: options.VerifiedRole ? `<@&${options.VerifiedRole}>` : "none", inline: true},
                            { name: "Welcome", value: toggles.Welcome ? icons.Yes : icons.No, inline: true},
                            { name: "Welcome Message Channel", value: options.WelcomeMessageChannel ? `<#${options.WelcomeMessageChannel}>` : "none", inline: true},
                            { name: "Welcome/Join Role", value: options.WelcomeAssignedRole ? `<@&${options.WelcomeAssignedRole}>` : "none", inline: true},
                        ]
                    }]
                })
        
            default:
                break;
        }
    }
}