const { Client,Collection } = require('discord.js');
const express = require('express'); 
const fs =require('fs');
const app = express();
require('dotenv').config();
const bot = new Client({disableMentions: "everyone"});
app.get("/stats",async(req,res)=>{
let stats = [];
stats.push({ping: bot.ws.ping,
servers:  bot.guilds.cache.size,
users: bot.users.cache.size,
channels: 
{all: bot.channels.cache.size,voice:bot.channels.cache.filter(c => c.type == 'voice').size,
text:bot.channels.cache.filter(c => c.type == 'voice').size}
});
res.json(await(stats));
});
app.get("/status",async(req,res)=>{
res.json(String('Все работает'));
});
app.get("/cmds",async(req,res)=>{
const cmdss = [];
bot.commands.forEach(ff => cmdss.push({name: ff.name,
description: ff.description_ru, 
category: ff.category,
description: ff.description_ru}));
res.json(await(cmdss))
});
app.get("/cmds/info/:id",async(req,res)=>{
let {id} = req.params;
const command = bot.commands.get(id) ||  bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(id)); 
console.log(command)
if(command === undefined || !id) return res.sendStatus(404)
let cmdsname = [];
cmdsname.push({name: command.name,
aliases: command.aliases,
description_ru: command.description_ru, 
description_en: command.description_en,
usages: command.usages,
 category: command.category })
res.json(await(cmdsname))
});
app.get("/guild/:id",async(req,res)=>{
let {id} = req.params;
if(!id || !bot.guilds.cache.get(id)) return res.sendStatus(404);
res.json(await(bot.guilds.cache.get(id)));
});
app.get("/fetchuser/:id",async(req,res)=>{
let {id} = req.params;
let member = bot.users.fetch(id);
if(!member || !id) return res.sendStatus(404);
res.json(await(member));
});
bot.commands = new Collection()
bot.aliases = new Collection()
 fs.readdir('./commands', (err, files) => { 
if (err) console.log(err)
files.forEach((element,iterator) => {
if(!element.includes(".")) {
fs.readdir(`./commands/${element}`,(err,sub_files)=>{
sub_files.forEach((elem,iterator)=>{
let props = require(`./commands/${element}/${elem}`);
bot.commands.set(props.name, props);
const alias = props.aliases
for (i = 0; i < alias.length; i++) {
bot.aliases.set(alias[i], props);
}
})
}) 
}
}) 
})
bot.on("message",message => {
if (!message.content.startsWith(process.env.prefix)) return;
const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
const cmdName = args.shift().toLowerCase();
const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
if(!command) return;
if (command) command.run(bot,message,args);
})   
app.listen(process.env.port);
console.log(`Порт ${process.env.port}`)
bot.login(process.env.token).catch(err => console.log(`Бот не смог зайти в дискорд`));
