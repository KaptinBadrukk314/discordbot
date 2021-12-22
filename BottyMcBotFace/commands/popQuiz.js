const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, DataTypes, Op } = require('sequelize');
const { MessageActionRow, MessageSelectMenu, Permissions, MessageEmbed } = require('discord.js');
const quiz = require('./quiz.json');

module.exports = {
	data: new SlashCommandBuilder()
      .setName('popQuiz')
      .setDescription('Pop quiz on a random topic');
      .addSubcommand( subcommand =>
         subcommand
            .setName('start')
            .setDescription('Starts a pop quiz queue')
            .addStringOption(option =>
               option
                  .setName('topic')
                  .setDescription('Specify the topic for the pop quiz')
                  .setRequired(false)))
   async execute(interaction){
      if(interaction.options.getSubcommand() === 'start'){
         const quizObj = JSON.parse(quiz);
         const topic = interaction.options.getString('topic');
         const questions;
         if(topic){
            //get questions from specified topic
            quizObj.topics.get(topic)
         } else {
            //get questions from random topic
         }
      }
   }
}
