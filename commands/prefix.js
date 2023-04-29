const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'prefix',
    aliases: [],
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
let newPrefix = args[0]
if(!args[0]) return 
if(args[1]) return
if(db.get(` ${process.env.owner}.prefix`) === newPrefix) return message.channel.send(`Le prefix est déjà \`${db.get(` ${process.env.owner}.prefix`)}\``)
else {
    db.set(` ${process.env.owner}.prefix`, args[0])
message.channel.send(`Mon prefix est maintenant : \`${args[0]}\``)
   }

        } else {

        }
    }
}