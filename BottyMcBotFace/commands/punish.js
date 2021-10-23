const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
		.setDescription('Punishment wheel commands')
      .addSubcommand( subcommand =>
         subcommand
            .setName('agree')
            .setDescription('Agree to be a participant')
            .addStringOption(option =>
               option.setName('twitchusername')
                  .setDescription('Provide twitch user name to agree to participate in the punishment wheel.')
                  .setRequired(true)))
      .addSubcommand( subcommand =>
         subcommand
            .setName('add')
            .setDescription('Propose a new punishment to add to the wheel. (Must be voted on to be added)')
            .addStringOption(option =>
               option.setName('name')
                  .setDescription('Provide a name for the punishment.')
                  .setRequired(true))
            .addStringOption(option =>
               option.setName('description')
                  .setDescription('Provide a description for the punishment.')
                  .setRequired(true)))
      .addSubcommand( subcommand=>
         subcommand
            .setName('vote')
            .setDescription('Select the punishments you would like to see on the wheel')),
   async execute(interaction, Vote, User, Punishment) {
      if (interaction.options.getSubcommand() === 'agree'){
         let temp = await User.findOne({
            where: {
               discordUsername:{
                  [Op.eq]: interaction.user.username
               }
            }
         });
         if(!temp){
            temp = await User.build({discordUsername: interaction.user.username, twitchUsername: interaction.options.getString('TwitchUsername')});
         }else if(temp.discordUsername && temp.twitchUsername){
            interaction.reply({content: 'You are all set to participate in the punishment wheel.', ephemeral: true});
         }else{
            temp.twitchUsername = interaction.options.getString('twitchusername');
         }
         await temp.save();
         await interaction.reply({content:'Thank you for signing up for punishment.', ephemeral: true});
      }else if(interaction.options.getSubcommand() === 'add'){
         let temp = await Punishment.findOne({
            where: {
               name:{
                  [Op.eq]: interaction.options.getString('name')
               }
            }
         });
         if(!temp){
            temp = await Punishment.build({name:interaction.options.getString('name'), description: interaction.options.getString('description')});
         }else{
            await interaction.reply({content: 'That name already exists in our database. Please resubmit with a unique name.', ephemeral: true});
         }
         await temp.save();
         await interaction.reply({content:'Your punishment has been added. For it to become active, other users must vote on your punishment to activate it.', ephemeral: true})
      } else if(interaction.options.getSubcommand() === 'vote'){
         const temp = await Punishment.findAll();
         let punishments = [];
         temp.forEach((item) => {
            const temp2 = {
               label: item.name,
               description: item.description,
               value: item.id
            }
            punishments.push(temp2);
         });
         //console.log(punishments);
         const row = new MessageActionRow()
            .addComponents(
                  new MessageSelectMenu()
                     .setCustomId('selectVote')
                     .setPlaceholder('Select to vote here')
                     .setMinValues(1)
                     .setMaxValues(punishments.length)
                     .addOptions(punishments)
            );

         const filter = (interaction) =>
            interaction.isSelectMenu()  && interaction.customId === 'selectVote';

         const collector = interaction.channel.createMessageComponentCollector({filter});

         collector.on('collect', async(collected) =>{
            let userVoteId = await User.findOne({
               where:{
                  discordUsername:{
                     [Op.eq]: collected.user.username
                  }
               }
            })
            //console.log(collected);
            //console.log(userVoteId.id);
            collected.values.forEach( async (item, i) => {
               try {
                  await collected.deferUpdate();
                  let newVote = await Vote.build({userId: userVoteId.id, punishmentId: item});
                  await newVote.save();
               } catch(err){
                  console.log(err);
               }
            });
            await collected.channel.send({content:'Your selections were submitted', ephemeral: true, components:[]});
         });
         await interaction.reply({content:'Select all punishments you would wish to see active.', ephemeral: true, components:[row]});
      }
   },
};
