const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: 'unowner',
    aliases: [],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
        if(process.env.owner === message.author.id || db.get(`ownermd.${message.author.id}`) === true) {

 
     if(args[0]){
        let member = client.users.cache.get(message.author.id);
        if (args[0]) {
            member = client.users.cache.get(args[0]);
        } else {
            return message.channel.send(`Aucun membre trouvé pour \`${args[0]|| "rien"}\``)

        }
        if (message.mentions.members.first()) {
            member = client.users.cache.get(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[0]|| "rien"}\``)
        if (db.get(`ownermd.${member.id}`) === null) { return message.channel.send(`${member.username} n'est pas owner`)}
      db.subtract(`${process.env.owner}.ownercount`,1)
        db.set(`${process.env.owner}.owner`,  db.get(`${process.env.owner}.owner`).filter(s => s !== member.id))
        db.set(`ownermd.${member.id}`, [])

            message.channel.send(`${member.username} n'est plus owner`)
        
       } else if(!args[0]) {
return
}
        }else {}
    }
}