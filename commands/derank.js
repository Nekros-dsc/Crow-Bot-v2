const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'derank',
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
   
            if(args[0]) {
        let user = await client.users.cache.get(args[0]) || message.mentions.members.first()  
        if(!user) return message.channel.send(`Aucun membre trouvée pour: \`${args[0]}\``)
if(user) {
    if (user.id === message.author.id) {
        return message.channel.send(`Vous n'avez pas la permission de **derank** <@${user.id}>`);
      }
      if(user.roles.highest.position > client.user.id) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **derank** <@${user.id}>`);
      if( db.get(`ownermd.${message.author.id}`) === true) return message.channel.send(`Vous n'avez pas la permission de **derank** <@${user.id}>`);
      if(process.env.owner === user.id) return message.channel.send(`Vous n'avez pas la permission de **derank** <@${user.id}>`);
  



     message.channel.send(`${user} à été **derank**`)
        user.roles.set([], `Derank par ${message.author.tag}`).catch(err => { })
        let chx = db.get(`uu_${message.guild.id}`);
        const logschannel = message.guild.channels.cache.get(chx)
       if(logschannel) logschannel.send(new Discord.MessageEmbed()
//         .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setColor(color)
 //       .setTitle(`<:protection:847072581382438953> Modération • Type: **\`derank\`**`)
   //     .setTimestamp() 
     //   .setDescription(`**Derank de**: ${user}\n**Auteur**: ${message.author}\n**Temps de réponse**: ${client.ws.ping}ms`)
     .setDescription(`${message.author} a **derank** ${user.user}`)  
     )
}}
        
     
} else {

}

    }
}