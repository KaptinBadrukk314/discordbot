const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
      .setName('mod')
      .setDescription('Moderator commands for moderating things.')
      .addSubcommand( subcommand =>
         subcommand
            .setName('remove')
            .setDescription('Remove a punishment. (Mod/Admin only)')
            .addStringOption(option =>
               option.setName('name')
               .setDescription('Name of punishment to remove.')
               .setRequired(true)))
      .setDefaultPermission(false),
      async execute(interaction, User, Vote, Punishment){
         if (interaction.options.getSubcommand() === 'remove'){
            const beRemoved = interaction.options.getString('name');
            let temp = await Punishment.findOne({
               where:{
                  name: beRemoved
               }
            });
            if(temp){
               await temp.destroy();
               await temp.save();
               await interaction.reply(`${interaction.userstate['username']} has removed ${beRemoved} from the Punishments.`);
            }else{
               await interaction.reply(`${beRemoved} does not exist in Punishments.`);
            }
         }
      }
   };
