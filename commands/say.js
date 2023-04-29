
const Discord = require("discord.js");
const interaction = {}
      const { MessageEmbed } = require("discord.js")
const db = require('quick.db')
const { MessageActionRow, MessageButton } = require('discord-buttons');
module.exports = {
    name: 'say',
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
        
        if (!args[0]) return
        if (args[0]){
            const msg = args.slice(0).join(' ')
            message.channel.send(msg).then(message.delete())
        }
        
        }
    }
}