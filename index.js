const Discord = require('discord.js')
const express = require("express"); 
const app = express();
const bot = new Discord.Client({disableMentions: "everyone"})
    app.get("/stats",async(req,res)=>{
        let stats = []
        stats.push({ping: bot.ws.ping ,servers:  bot.guilds.cache.size , users: bot.users.cache.size, channels: {all: bot.channels.cache.size,voice:bot.channels.cache.filter(c => c.type == 'voice').size,text:bot.channels.cache.filter(c => c.type == 'voice').size}})
         res.json(await(stats))
    });
    app.get("/status",async(req,res)=>{
         res.json(String('Все работает'))
    });
app.get("/cmds",async(req,res)=>{
    const hhh = [];
    bot.commands.forEach(ff => hhh.push({name: ff.name, description: ff.description_ru, category: ff.category, description: ff.description_ru}));
    res.json(await(hhh))
});
app.get("/cmds/info/:id",async(req,res)=>{
    let {id} = req.params;
    const command = bot.commands.get(id) ||  bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(id)); 
    console.log(command)
    if(command === undefined || !id) return res.sendStatus(404)
        let hui = []
        hui.push({name: command.name, aliases: command.aliases, description_ru: command.description_ru, description_en: command.description_en, usages: command.usages,cooldown: command.cooldown , category: command.category })
    res.json(await(hui))
});
app.get("/guild/:id",async(req,res)=>{
    let {id} = req.params;
    if(!id) return res.sendStatus(404)
     res.json(await(bot.guilds.cache.get(id)))
});
app.get("/fetch/:id",async(req,res)=>{
    let {id} = req.params;
    let member = bot.users.fetch(id)
    if(!member) return res.sendStatus(404)
     res.json(await(member))
});
 
app.listen(1111)
bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

bot.login(`TOKEN BOT`).catch(err => console.log(`НЕ могу зайти в дс`))
