const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();

const opts = {
   identity: {
      username: process.env.BOTNAME,
      password: process.env.PASS
   },
   channels:[
      process.env.CHANNELS
   ]
}

const client = new tmi.client(opts);
var users = [];
var punishments = [
   'Timeout for 30 seconds',
   'emote-only',
   '5 pushups',
   'Discord Role'
];

client.on('message', (channel, userstate, message, self) =>{
   if (self) { return;}

   if(!users.includes(userstate['username'])){
      users.push(userstate['username']);
   }

   const commandName = message.trim();

   if (commandName.startsWith('!TrickOrTreat') || commandName.startsWith('!trickortreat') || commandName.startsWith('!tot')){
      let arr = message.trim().split(" ");
      let user = arr.filter(trickHelper);
      let num = Math.floor(Math.random() * 2);
      console.log(user);
      console.log(arr);
      console.log(num);
      if (num == 1){//treat
         client.say(channel, `${userstate['username']} gave a treat to ${user}`);
      }else{
         client.say(channel, `${userstate['username']} tricked ${user}`);
      }
   }
   if (commandName.startsWith('!spin') || commandName.startsWith('!punish')){
      var punishment = punishments[Math.floor(Math.random() * punishments.length)];
      var user = users[Math.floor(Math.random() * users.length)];
      client.say(channel, `${user} has to endure ${punishment}`);
   }
});

function trickHelper(value, index, array){
   return value.startsWith('@');
}

client.on('connected', onConnectedHandler);

client.connect();

function onConnectedHandler(addr, port){
   console.log(`* Connected to ${addr}:${port}`);
}
