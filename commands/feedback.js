import { SlashCommandBuilder } from '@discordjs/builders';

const feedbackCommand = new SlashCommandBuilder()
  .setName('feedback')
  .setDescription('Register a user to the server officially');

export default feedbackCommand.toJSON();