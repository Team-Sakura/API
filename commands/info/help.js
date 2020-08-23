const { MessageEmbed } = require("discord.js"); 
module.exports = {
   name: 'help',
   aliases:['h'],
   description_en: 'List commands',
   description_ru: 'Список доступных команд',
   usages: ['[commands]','help'],
   uses: 0,
   category: 'info',

async run(bot, message, args) {

    let embed = new MessageEmbed()
        .setAuthor(message.author.username,message.author.avatarURL())
        .setDescription(`Все мои команды
${bot.commands.filter(c => c.category === 'info').map(c => `\`${process.env.prefix}${c.name}\``).join(', ')}`)
        .addField(`Ссылки`,`Сайт: http://localhost:${process.env.port}
Сервер поддержки: https://discord.gg/Eh9thsa
Мой код на гитхабе: https://github.com/XDENIX/API`)
        .addField(`Мой разработчик`,`**${bot.users.cache.get(process.env.owner).tag}**`);

message.channel.send(embed)
   }
}