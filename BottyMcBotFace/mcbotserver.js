const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const wait = require('util').promisify(setTimeout);
//const Discord = require('discord.js')

const opts = {
   identity: {
      username: process.env.BOTNAME,
      password: process.env.PASS
   },
   channels:[
      process.env.CHANNELS
   ]
}

const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS] });

const clientTwitch = new tmi.client(opts);
var users = [];
var punishments = [
   'Timeout for 30 seconds',
   'emote-only',
   '5 pushups',
   'Discord Role'
];

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

clientDiscord.commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	clientDiscord.commands.push(command.data.toJSON());
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		clientDiscord.once(event.name, (...args) => event.execute(...args));
	} else {
		clientDiscord.on(event.name, (...args) => event.execute(...args));
	}
}

clientDiscord.on('interactionCreate', async interaction =>{
   if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

clientTwitch.on('message', (channel, userstate, message, self) =>{
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
         clientTwitch.say(channel, `${userstate['username']} gave a treat to ${user}`);
      }else{
         clientTwitch.say(channel, `${userstate['username']} tricked ${user}`);
      }
   }
   if (commandName.startsWith('!spin') || commandName.startsWith('!punish')){
      var punishment = punishments[Math.floor(Math.random() * punishments.length)];
      var user = users[Math.floor(Math.random() * users.length)];
      clientTwitch.say(channel, `${user} has to endure ${punishment}`);
   }
});

function trickHelper(value, index, array){
   return value.startsWith('@');
}

clientTwitch.on('connected', onConnectedHandler);

clientTwitch.connect();
clientDiscord.login(token);

function onConnectedHandler(addr, port){
   console.log(`* Connected to ${addr}:${port}`);
}
