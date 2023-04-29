const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'joinvoc',
    aliases: ["startvoc"],
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
const joinvoc = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
if (args[0] == "remove"){
    const joinnvoc = db.get(`startvoc_${process.env.OWNER}`, joinvoc.id)
    if (joinnvoc) joinvoc.leave().catch(e => { });
    db.delete(`startvoc_${process.env.OWNER}`)
    message.channel.send('Le salon de démarage a été supprimer')
}
else if (!joinvoc){
    message.channel.send('Vous devez mettre l\'id d\'un salon ou mentionner un salon valide')
}
else if (joinvoc){
db.set(`startvoc_${process.env.OWNER}`, joinvoc.id)
joinvoc.join().catch(e => { })
message.channel.send('Le salon de démarrage a été setup')
}
        }
    }
}