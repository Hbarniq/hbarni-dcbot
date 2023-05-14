import * as dotenv from 'dotenv';
import { Client, CommandInteraction, ComponentInteraction, ModalSubmitInteraction, Member, TextableChannel, User, Webhook } from 'oceanic.js';

import { Logger } from './logger.js';
import guildConfigs from './schemas/guild-configs.js';

export function discordTime(time: Date) {
    return Math.floor(time.valueOf() / 1000);
}

export function dynamicAvatarURL(user: User | Member | undefined) {
    return user?.avatarURL(user.avatar?.startsWith("a_") ? "gif" : "png", 128);
}

export async function getGuildData(guildID: string) {
    return await guildConfigs.findOne({ "GuildData.guildId": guildID });
}

export async function getSelfWebhook(name: string, interaction: CommandInteraction | ComponentInteraction | ModalSubmitInteraction, client: Client) {
  if (interaction.channel instanceof TextableChannel) {
    let webhook: Webhook | undefined

    webhook = (await interaction.guild?.getWebhooks())?.find((w) => w.name == name && w.applicationID == client.application.id)

    if (!webhook) {
        webhook = await interaction.channel.createWebhook({ name: "user-embeds", reason: `created for sending user embeds, this webhook will be reused` });
    } else if (webhook?.channel?.id != interaction.channel.id) {
        webhook = await webhook?.edit({ channelID: interaction.channel.id });
    }

    return webhook;
  } else return undefined;
}

export async function formatTime(seconds: number): Promise<string> {
    const minutes = Math.floor((seconds % 3600) / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingSeconds = seconds % 60;
  
    const timeSegments = [];
  
    if (days > 0) {
      timeSegments.push(`${days} day${days > 1 ? "s" : ""}`);
    }
  
    if (remainingHours > 0) {
      timeSegments.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
    }
  
    if (minutes > 0) {
      timeSegments.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
  
    if (remainingSeconds > 0) {
      timeSegments.push(
        `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
      );
    }
  
    const formattedTime = timeSegments.slice(0, 2).join(", ");
  
    return formattedTime.length === 0 ? "0 seconds" : formattedTime;
}

export function getDotenv() {
    dotenv.config();

    const { DISCORD_BOT_TOKEN, DATABASE_TOKEN, RELEASE, DEVS } = process.env

    if ([DISCORD_BOT_TOKEN, DATABASE_TOKEN, RELEASE, DEVS].some(v => !v)) {
        Logger.fatal("Some ENV variables are undefined");
    }
}