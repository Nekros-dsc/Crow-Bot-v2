const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')

module.exports = {
name: 'tempvoc',
aliases: ["tempovoc"],
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
    const tempvoc = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if (!tempvoc){
        message.channel.send('Vous devez mettre l\'id d\'un salon ou mentionner un salon valide')
    }
    if (args[0] == "remove"){
        db.delete(`tempchannel_${message.guild.id}`)
        message.channel.send('Le salon temporaire a été supprimer')
    }
    else if (tempvoc){
    db.set(`tempchannel_${message.guild.id}`, tempvoc.id)
    message.channel.send('Le salon de démarrage a été setup')
    }
}
}
}