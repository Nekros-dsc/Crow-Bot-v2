const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'antilink',
    aliases: ["antiinvite"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
   
        if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}` ) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
        if(args[0] === "on") {
            if(db.get(`link_${message.guild.id}`) === true) return message.channel.send(`L'antilink est déjà activé`)
              db.set(`link_${message.guild.id}`, true)
            message.channel.send(`L'antilink est maintenant activé`)
        }  else if(args[0] === "off") {
            if(db.get(`link_${message.guild.id}`) === null) return message.channel.send(`L'antilink est déjà désactivé`)
            db.set(`link_${message.guild.id}`, null)
            message.channel.send(`L'antilink est maintenant désactivé`)
        }  else if(args[0] === "invite") {
            if(db.get(`typelink_${message.guild.id}`) === " invite") return message.channel.send(`L'antilink ne détectait déjà que les invitations`)
            db.set(`typelink_${message.guild.id}`, " invite")
            message.channel.send(`L'antilink ne détectera plus que les invitations`)
        } else if(args[0] === "all") {
            if(db.get(`typelink_${message.guild.id}`) === " all") return message.channel.send(`L'antilink ne détectait déjà que les liens`)
            db.set(`typelink_${message.guild.id}`, " all")
            message.channel.send(`L'antilink ne détectera plus que les liens`)
        }

        } else {

        }
    }
}