import { InteractionType, REST, Routes } from "discord.js";
import { createNotionPage } from "./notionService/notionService.js";
import feedbackCommand from "./commands/feedback.js";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const DiscordApiKey = process.env.DISCORD_API_KEY;
const DiscordServerID = process.env.SERVER_ID;
const DiscordBotID = process.env.BOT_ID;

export async function run(client) {
  const commands = [feedbackCommand];

  const rest = new REST({ version: "10" }).setToken(DiscordApiKey);

  try {
    await rest.put(
      Routes.applicationGuildCommands(DiscordBotID, DiscordServerID),
      {
        body: commands,
      }
    );

    client.on("interactionCreate", async (interaction) => {
      if (interaction.isChatInputCommand()) {
        if (interaction.commandName === "feedback") {
          const modal = new ModalBuilder()
            .setCustomId("feedbackId")
            .setTitle("Feedback");

          const feedbackInput = new TextInputBuilder()
            .setCustomId("feedbackInputId")
            .setLabel("please submit your feedback here")
            .setStyle(TextInputStyle.Short);

          const firstActionRow = new ActionRowBuilder().addComponents(
            feedbackInput
          );

          modal.addComponents(firstActionRow);

          interaction.showModal(modal);
        }
      }
      if (interaction.type === InteractionType.ModalSubmit) {
        console.log("Modal Submitted...");

        if (interaction.customId === "feedbackId") {
          const notionPost =
            interaction.fields.getTextInputValue("feedbackInputId");
          const nameofuser = interaction.user.username;
          console.log(nameofuser);
          console.log(notionPost);
          createNotionPage(nameofuser, notionPost);
          interaction.reply("You successfully submitted your details!");
        }
      }
    });

    client.login(DiscordApiKey);
  } catch (error) {
    console.error(error);
  }
}
