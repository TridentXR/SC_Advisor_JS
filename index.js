// Init Variables
const { Client, Events, GatewayIntentBits, Collection, DiscordAPIError, discordSort, messageLink } = require('discord.js');
let Discord = require("discord.js")
const client = new Discord.Client({ intents: new Discord.IntentsBitField(3276799) });
const { clientId, guildId, token, prefix} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path')
const axios = require('axios');
const { request } = require('undici');
const { EmbedBuilder } = require('discord.js');
const { channelMention, roleMention, userMention } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

client.Commands = new Collection();
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Init
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    
	if ('data' in command && 'execute' in command) {
		client.Commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Connections
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
    if (msg.author.id !== client.user.id) {
        const catResult = await request('https://api.starcitizen-api.com/99fa5aad810910f933038db8dd4944c1/v1/cache/user/LeviathanStatus');
		const { data } = await catResult.body.json();

        switch (msg.content) {
            case `${prefix}meme`:
                msg.reply(data.profile.handle);
                
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('primary')
                        .setLabel('Click me!')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('secondary')
                        .setLabel("Don't Click Me")
                        .setStyle(ButtonStyle.Danger)
                );

                msg.reply({content: "Here's your meme asshole", components: [row] });
                
                break;

            case `${prefix}test`:
                const embed = new EmbedBuilder()
                    .setColor(0xEFFF00)
                    .setTimestamp()
                    .setDescription("This is a test Description")
                    .setTitle("Test Title")
                    .setURL("https://discord.js.org")
                    .setImage('https://i.imgur.com/AfFp7pu.png')
                    .setThumbnail(data.profile.image)
                    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                    .addFields({name: "Test Field Name", value: 'ur mother', inline: true},{name: "Test Field Name 2", value: 'ur sister', inline: false});
                msg.reply({embeds: [embed]});
                break;
        }
    }
});

// Slash Interactions
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;	
    const command = interaction.client.Commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});

// Button Interactions
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isButton()) return;

    if (interaction.customId === 'primary') {
        interaction.reply("Test");
    } else if (interaction.customId === 'secondary') {
        interaction.reply("Don't Test");
    }
});

// Functions

// Login Execution
client.login(token);