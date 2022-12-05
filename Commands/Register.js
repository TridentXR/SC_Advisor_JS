// Inclusions
const {SlashCommandBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { request } = require('undici');
const { ComponentType } = require('discord.js');
const fs = require('node:fs');

// Exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Gets your registration process started.')
        .addStringOption(option => option
            .setName('handle')
            .setDescription('Please provide your Star Citizen Handle. This can be found on the RSI Website.')
            .setRequired(true)),

    async execute(interaction) {
        const newHandle = interaction.options.getString('handle');
        const catResult = await request(`https://api.starcitizen-api.com/99fa5aad810910f933038db8dd4944c1/v1/live/user/${newHandle}`);
		const { data } = await catResult.body.json();
        var readData = JSON.parse(fs.readFileSync('./Database_Storage/user_database.json', "utf8") || "[]");
        var result = false

        for (let i = 0; i < readData.length; i++) {
            if (readData[i] && data && data.profile.handle && readData[i].Handle == data.profile.handle) {
                result = true;
                break;
            }
        }

        if (!result && data && data.profile && data.profile.handle) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Correct')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('deny')
                        .setLabel("Incorrect")
                        .setStyle(ButtonStyle.Danger)
                );

            const msg = await interaction.reply({content: "Found your account: " + data.profile.page.url + "\n\n**If the information provided is correct, please click the confirmation button!**", ephemeral: false, components: [row]});
            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

            collector.on('collect', i => {
                if (i.user.id === interaction.user.id) {
                    if (i.customId === 'confirm') {
                        var newList = {Handle: data.profile.handle, ProfileURL: data.profile.page.url, UserID: i.user.id}
                        interaction.followUp("Thank you for confirming! To continue, please run the following command: `/Agreement`");

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('confirm')
                                    .setLabel('Correct')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('deny')
                                    .setLabel("Incorrect")
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                            );
                        
                        readData.splice(0,0,newList)
                        fs.writeFileSync('./Database_Storage/user_database.json',JSON.stringify(readData));
                        interaction.editReply({components: [row]});
                    } else if (i.customId === 'deny') {
                        interaction.followUp(`Please run the command again!`);

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('confirm')
                                    .setLabel('Correct')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('deny')
                                    .setLabel("Incorrect")
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                            );
                            
                        interaction.editReply({components: [row]});
                    }
                } else {
                    interaction.followUp({content: `These buttons aren't for you!`, ephemeral: true});
                }
            });
        } else {
            if (!result) {
                await interaction.reply({content: "We couldn't find your account! Try running the command again and ensure you are providing the correct handle!", ephemeral: false});
            } else {
                await interaction.reply({content: "You have already been registered!", ephemeral: false});
            }
        }
    },
};