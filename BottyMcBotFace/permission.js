const { Client, Collection, Intents } = require('discord.js');
const { Sequelize, DataTypes, Op } = require('sequelize');
const tmi = require('tmi.js');
const fs = require('fs');
const { token } = require('./config.json');
const guildId = process.env.GUILD_ID;


const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });

const fullPermissions = [
   {
      id: '901877522801754203',
      permissions: [{//Supermod
            id: '887829537105281095',
            type: 'ROLE',
            permission: true,
         },{//mod
            id: '877028586333282364',
            type: 'ROLE',
            permission: true,
         },{//admin
            id: '879048992858701924',
            type: 'ROLE',
            permission: true,
         },{//squig
            id: '876528458098946098',
            type: 'ROLE',
            permission: false,
         },],
   },
];
clientDiscord.login(token);

module.exports = {
   runPermissions: async function(){
      await clientDiscord.guilds.cache.get(guildId)?.commands.permissions.set({ fullPermissions });
      console.log('Permissions maybe set');
      return 0;
   }
}
