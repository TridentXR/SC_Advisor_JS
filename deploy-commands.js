const { REST, Routes } = require('discord.js');
const { clientId, guildId, token, devBuild } = require('./config.json');
const fs = require('node:fs');
var data;
var data2;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (!devBuild) {
			data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		};

		if (devBuild) {
			data2 = await rest.put(
				Routes.applicationGuildCommands(clientId,guildId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data2.length} application (/) commands.`);
		};
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();