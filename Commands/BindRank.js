// Inclusions
const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');

// Exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bindrank')
        .setDescription('Replies with Pong!')
        .addRoleOption(option => option
            .setName('rank')
            .setDescription('The role to bind.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('insignia')
            .setDescription('The insignia that goes with this role.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('position')
            .setDescription('The position this role belongs in. Use a zero reference (0 = 1, 1 = 2)')
            .setRequired(true)),
    async execute(interaction) {
        const newInsig = interaction.options.getString('insignia');
        const newRole = interaction.options.getRole('rank');
        const newPos = interaction.options.getInteger('position');
        var guildData = JSON.parse(fs.readFileSync('./Database_Storage/guild_database.json', "utf8") || "[]");
        var result = false

        for (let i = 0; i < guildData.length; i++) {
            if (guildData[i] && guildData[i].RankID == newRole.id) {
                result = true
                break;
            }
        }

        if (!result) {
            guildData.splice(newPos,0,{RankID: newRole.id, Insignia: newInsig, Pos: newPos, BoundRoles: []});
            fs.writeFileSync('./Database_Storage/guild_database.json',JSON.stringify(guildData));
            await interaction.reply({content: "Binding created!", ephemeral: true});
        } else {
            await interaction.reply({content: "This rank binding already exists!", ephemeral: true});
        }
    },
};