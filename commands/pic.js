const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: 'pic',
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
   if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true || db.get(`public_${message.guild.id}`) === true) {
    let user = message.mentions.users.first() || args[0];
    if (!args[0]) user = message.author
    if(!user.avatarURL({  dynamic: true })) return message.channel.send("Il n'y a pas de bannière sur ce serveur")
    const avatarEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`Voici la photo de profile de ${user.tag}`)
        .setImage(`${user.avatarURL({  dynamic: true })}`);
    message.channel.send(avatarEmbed).catch(err => { });
}
    }
}