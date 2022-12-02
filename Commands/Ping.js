// Inclusions
const {SlashCommandBuilder} = require('discord.js');

// Exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addBooleanOption(option => option
            .setName('local')
            .setDescription('Whether or not this response should be hidden to only you to seen by all.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('input')
            .setDescription('The new one')),
    async execute(interaction) {
        const newOptional = interaction.options.getString('input');
        const newEph = interaction.options.getBoolean('local');
        await interaction.reply({content: `Pong! Here's the new optional too: ${newOptional}`, ephemeral: newEph});
    },
};