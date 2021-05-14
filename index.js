require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();

client.login(token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.map(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
})

const prefix = '!';

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if(!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
})
