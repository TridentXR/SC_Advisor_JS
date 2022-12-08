// Inclusions
const {SlashCommandBuilder} = require('discord.js');
const { ComponentType } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('node:fs');
const { EmbedBuilder } = require('discord.js');

// Exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('agreement')
        .setDescription('Read and reaction to the agreement complete your registration!'),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Accept Agreement')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('reject')
                    .setLabel("Reject Agreement")
                    .setStyle(ButtonStyle.Danger)
            );

        const msg = await interaction.reply({content: "**Navistar Agreement**\nI will not divulge information about the organization or its members to those outside of this organization. I will notify command if I may have violated this pledge, whether intentionally or unintentionally. I will follow all orders and work in unison with my superiors and work in unison with those chosen to lead. I will notify command if I feel overburdened with my organization responsibilities. I will strive to take the initiative to the best of my ability and will notify command if I would like to take on greater responsibility and rank.", ephemeral: false, components: [row]});
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === 'accept') {
                    interaction.followUp("You have accepted our agreement! Welcome to the organization!");
                    interaction.member.roles.add("1035665428372004954")
                    interaction.member.roles.add("1035687396609626142")
                    var advisorChannel = interaction.guild.channels.cache.get("1035439556733980672")
                    var readData = JSON.parse(fs.readFileSync('./Database_Storage/user_database.json', "utf8") || "[]");

                    for (let i = 0; i < readData.length; i++) {
                        if (readData[i] && readData[i].UserID == interaction.user.id) {
                            const embed = new EmbedBuilder()
                                .setTimestamp()
                                .setTitle("Registration Complete")
                                .setDescription("User has completed their registration.")
                                .setURL(readData[i].ProfileURL)
                                .setImage(readData[i].ProfilePicture)
                                .setThumbnail(interaction.user.displayAvatarURL())
                                .addFields(
                                    {name: "User RSI Handle", value: readData[i].Handle, inline: true},
                                    {name: "User ID", value: readData[i].UserID, inline: false},
                                    {name: "Date of Enlistment", value: readData[i].DateOfReg, inline: false},
                                    {name: "Langauge Fluency", value: readData[i].Fluency, inline: false},
                                    {name: "Agreement", value: "I will not divulge information about the organization or its members to those outside of this organization. I will notify command if I may have violated this pledge, whether intentionally or unintentionally. I will follow all orders and work in unison with my superiors and work in unison with those chosen to lead. I will notify command if I feel overburdened with my organization responsibilities. I will strive to take the initiative to the best of my ability and will notify command if I would like to take on greater responsibility and rank.", inline: false},
                                    {name: "Agreement Status - V1", value: "Agreement has been Acknowledged and Accepted", inline: false},
                                );
                            advisorChannel.send({embeds: [embed]});
                            
                            break;
                        }
                    }

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('accept')
                                .setLabel('Accept Agreement')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('reject')
                                .setLabel("Reject Agreement")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        );
                    
                    interaction.editReply({components: [row]});
                } else if (i.customId === 'reject') {
                    interaction.followUp(`We're sorry you didn't agree! Goodbye!`);

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('accept')
                                .setLabel('Accept Agreement')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('reject')
                                .setLabel("Reject Agreement")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        );
                        
                    interaction.editReply({components: [row]});
                    interaction.member.kick()
                }
            } else {
                interaction.followUp({content: `These buttons aren't for you!`, ephemeral: true});
            }
        });
    },
};