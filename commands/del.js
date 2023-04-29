const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')
  let random_string = require("randomstring");

module.exports = {
name: 'del',
aliases: [],
run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color



    if(!message.guild) return;
    var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
return;
        }


    if (args[0] === "sanctions") {
        if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true) {
            let id = args[2]
            let user  = message.mentions.users.first() || client.users.cache.get(args[1])
            let database = db.fetch(`info.${message.guild.id}.${user.id}`)
            if(!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1]}\``)
        
      
        
            if (!database || database == []) return message.channel.send(`Aucun membre trouvé avec des sanctions pour \`${args[1] || "rien"}\``)
     
            if (!database.find(data => data.id === id)) return message.channel.send(`Aucune sanctions trouvé pour \`${args[2] || "rien"}\``)
        
        
        
        
            database.splice(database.findIndex(data => data.id == id), 1)
        if(database.length >= 1){
            db.subtract(`number.${message.guild.id}.${user.id}`, 1)
            db.set(`info.${message.guild.id}.${user.id}`, database)
        }else {
            db.delete(`number.${message.guild.id}.${user.id}`)
        db.delete(`info.${message.guild.id}.${user.id}`)

        }
            message.channel.send(`La sanctions **${args[2]}** a été supprimé`)
    
    } else {
    }}
}
}