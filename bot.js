import { run } from './discordService.js';
import {Client,GatewayIntentBits} from "discord.js";

const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,],});

run(client);

client.on("ready", () => {console.log(`logged in as ${client.user.tag}`)});