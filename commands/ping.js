const Discord = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'ping',
    aliases: [""],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
   var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
return;
        }
      if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true || db.get(`public_${message.guild.id}`) === true ) {
 
        let embeeed = new Discord.MessageEmbed()
        embeeed.addField("Ping", `Calcul en cours`, true)
        embeeed.addField("Latence", `${client.ws.ping}ms`, true)
        embeeed.setColor(color)

        let msg = await message.channel.send(embeeed)
        let embed = new Discord.MessageEmbed()
        embed.addField("Ping", `${msg.createdAt - message.createdAt + "ms"}`, true)
embed.addField("Latence", `${client.ws.ping}ms`, true)
        embed.setColor(color)
          
        return msg.edit("", embed)
  } else {}
}
}