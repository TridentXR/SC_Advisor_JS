// Inclusions
const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');

// Exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bindrole')
        .setDescription('Replies with Pong!')
        .addRoleOption(option => option
            .setName('rank')
            .setDescription('The rank to bind the role to.')
            .setRequired(true))
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role to bind.')
            .setRequired(true)),
    async execute(interaction) {
        const newRank = interaction.options.getRole('rank');
        const newRole = interaction.options.getRole('role');
        var guildData = JSON.parse(fs.readFileSync('./Database_Storage/guild_database.json', "utf8") || "[]");
        var result = false

        for (let i = 0; i < guildData.length; i++) {
            if (guildData[i] && guildData[i].RankID == newRank.id) {
                result = true
                guildData[i].BoundRoles.push(newRole.id)
                fs.writeFileSync('./Database_Storage/guild_database.json',JSON.stringify(guildData));
                await interaction.reply({content: "Binding created!", ephemeral: true});
                break;
            }
        }

        if (!result) {
            await interaction.reply({content: "Binding could not be completed!", ephemeral: true});
        }
    },
};