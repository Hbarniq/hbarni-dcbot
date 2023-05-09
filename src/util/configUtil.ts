import { CommandInteraction, Constants } from 'oceanic.js';

import { colors, icons } from './constants.js';

export async function checkValidId(Id: string, type: string, interaction: CommandInteraction) {
    switch (type) {
        case "channel id":
            
            if (interaction.guild?.channels.find((c) => c.id == Id)) {
                return true;
            } else return false;

        case "role id":

            if (interaction.guild?.roles.find((r) => r.id == Id)) {
                return true;
            } else return false; 
    
        default:
            return true;
    }
}

export async function initFeature(passed: string, interaction: CommandInteraction, guildConfig: any) {
    if (["Verification", "VerificationChannel", "VerifiedRole"].includes(passed)) {
        if (guildConfig.Configs.FeatureToggles.Verification && guildConfig.Configs.Options.VerificationChannel && guildConfig.Configs.Options.VerifiedRole) {

            interaction.channel?.createMessage({
                embeds: [
                {
                    description: `
                    **${icons.Cogwheel} update roles?**
                    this will restrict @everyone to only see <#${guildConfig.Configs.Options.VerificationChannel}>
                    and give <@&${guildConfig.Configs.Options.VerifiedRole}> the view channels permission
                    `,
                    color: colors.Neutral
                }],
                components: [{
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [{
                        type: Constants.ComponentTypes.BUTTON,
                        customID: "SetupVerifiedRoles",
                        label: "update roles",
                        style: Constants.ButtonStyles.PRIMARY
                    },
                    {
                        type: Constants.ComponentTypes.BUTTON,
                        customID: "SkipSetupVerifiedRoles",
                        label: "skip",
                        style: Constants.ButtonStyles.SECONDARY
                    }
                ]
                }
            ]
            })

            return true;
        } else return false;
    } else return undefined;
}

export async function parseOptionValue(value: string): Promise<string> {
    if (/<@&[0-9]*>/g.test(value)) return value.substring(3, value.length - 1);
    else if (/<#[0-9]*>/g.test(value) || /<@[0-9]*>/g.test(value)) return value.substring(2, value.length -1);
    else return value
}