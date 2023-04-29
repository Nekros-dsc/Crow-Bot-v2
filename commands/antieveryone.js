const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'antieveryone',
    aliases: ["antiping"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
return;
        }

        if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
            if(args[0] === "on") {
                if(db.get(`everyone_${message.guild.id}`) === true) return message.channel.send(`L'antieveryone est déjà activé`)
                  db.set(`everyone_${message.guild.id}`, true)
                message.channel.send(`L'antieveryone est maintenant activé`)
            }  else if(args[0] === "off") {
                if(db.get(`everyone_${message.guild.id}`) === null) return message.channel.send(`L'antieveryone est déjà désactivé`)
                db.set(`everyone_${message.guild.id}`, null)
                message.channel.send(`L'antieveryone est maintenant désactivé`)
            }

        } else {

        }
    }
}