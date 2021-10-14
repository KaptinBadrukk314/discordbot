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
let gummy_count = 0;
let laugh_count = 0;
const client = new tmi.client(opts);

client.on('message', (channel, userstate, message, self) =>{
   if (self) { return;}

   const commandName = message.trim();
   switch(userstate['mod']) {
      case true:{
         if (commandName === '!gummy'){
            client.say(channel,`${userstate['username']}Updated the gummy count.`);
            let count = gummy();
            console.log(`Gummy incremented to ${count}`);
         }
         if (commandName === '!laugh'){
            client.say(channel, `${userstate['username']}Updated the laugh count.`);
            let count = laugh();
            console.log(`Gummy incremented to ${count}`);
         }
         break;
      }
      case false:{
         if (commandName === '!gummy'){
            client.say(channel, `${userstate['username']} voted to increase the gummy count.`);
         }
         if (commandName === '!laugh'){
            client.say(channel, `${userstate['username']} voted to increase the gummy count.`);
         }
         break;
      }
   }
});
client.on('connected', onConnectedHandler);

client.connect();

function gummy(){
   gummy_count+=1;
   fs.writeFile('Gummy pack count.txt', gummy_count.toString(), (err) =>{
      if (err){
         console.log('Error writing gummy_count');
         throw err;
      }
   });
   return gummy_count;
}

function laugh(){
   laugh_count+=1;
   fs.writeFile('Laugh count.txt', laugh_count.toString(), (err) =>{
      if (err){
         console.log('Error writing gummy_count');
         throw err;
      }
   });
   return laugh_count;
}

function onConnectedHandler(addr, port){
   console.log(`* Connected to ${addr}:${port}`);
}
