import {Client,GatewayIntentBits} from "discord.js";
import { REST, Routes } from "discord.js";
import { createNotionPage } from "./notionService.js";
import dotenv from 'dotenv';
dotenv.config();

const DiscordApiKey = process.env.DISCORD_API_KEY;
const DiscordServerID = process.env.SERVER_ID;
const DiscordBotID = process.env.BOT_ID;

const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,],});

client.on("ready", () => {console.log(`logged in as ${client.user.tag}`)});

async function run() {
  const commands = [
    {
      name: "submit",
      description: "submit your feedback",
      options : [{
        name : 'suggestion',
        description : 'suggestion for moderators',
        type : 3,
        required : true,
      },
    ], 
    },
  ];

  const rest = new REST({ version: "10" }).setToken(DiscordApiKey);
  
  try {
    await rest.put(Routes.applicationGuildCommands(DiscordBotID, DiscordServerID), { 
      body: commands
     });

     client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;
    
      if (interaction.commandName === 'submit') {
        
        const notionPost = interaction.options.get('suggestion').value; 
        console.log(`feedback content : ${notionPost}`);

        const nameofuser=interaction.user.username;  
        console.log(`feedback author  : ${nameofuser}`)
        
        createNotionPage(nameofuser,notionPost)

        await interaction.reply('Thank You! your feedback has been submitted.');
      
      }
    }); 
    client.login(DiscordApiKey);  
  } 
  catch (error) {
    console.error(error);
  }
}
run();