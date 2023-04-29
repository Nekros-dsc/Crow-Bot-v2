const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'kick',
    aliases: ["k"],
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
     if(args[0]){
            let reason = args.slice(1).join(' ');
            if (message.mentions.users.size < 1) return message.channel.send(usage);
            let user = await client.users.cache.get(args[0]) || message.mentions.members.first()  
            if(!user) return message.channel.send(`Aucun membre trouvée pour: \`${args[0]}\``)
            if (user.id === message.author.id) {
                return message.channel.send(`Vous n'avez pas la permission de **mute** <@${user.id}>`);
              }
              if(user.roles.highest.position > client.user.id) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **kick** <@${user.id}>`);
              if( db.get(`ownermd.${message.author.id}`) === true) return message.channel.send(`Vous n'avez pas la permission de **kick** <@${user.id}>`);
              if(process.env.owner === user.id) return message.channel.send(`Vous n'avez pas la permission de **kick** <@${user.id}>`);
            if (!message.guild.member(user).bannable) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **kick** <@${user.id}>`);
           
            if(!reason) {
              message.channel.send(`${user} a été **kick**`);
              user.send(`Vous avez été **kick** de ${message.guild.name}`)
          message.guild.members.cache.get(user.user.id).kick(`Expulser par ${message.author.tag}`); 
          let chx = db.get(`uu_${message.guild.id}`);
          if (chx === null) {
            return;
          }
          const logschannel = message.guild.channels.cache.get(chx)
          if(logschannel)  logschannel.send(new Discord.MessageEmbed()
          //.setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor(data.color)
           // .setTitle(`<:protection:847072581382438953> Modération • Type: **\`expulsion\`**`)
          //  .setTimestamp() 
            //.setDescription(`**Expulsion de**: ${user}\n**Auteur**: ${message.author}\n**Pour**: \`${reason}\`\n**Temps de réponse**: ${client.ws.ping}ms`)
            .setDescription(`${message.author} a **kick** ${user.user}`)  
          ) 
         } else {
          message.channel.send(`${user} a été **kick** pour \`${reason}\``);
          user.send(`Vous avez été **kick** de ${message.guild.name} pour \`${reason}\``)
          message.guild.member(user).kick(`Expulser par ${message.author.tag} pour ${reason}`); 
          let chx = db.get(`uu_${message.guild.id}`);
          if (chx === null) {
            return;
          }
          const logschannel = message.guild.channels.cache.get(chx)
          if(logschannel) logschannel.send(new Discord.MessageEmbed()
          //.setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor(data.color)
           // .setTitle(`<:protection:847072581382438953> Modération • Type: **\`expulsion\`**`)
          //  .setTimestamp() 
            //.setDescription(`**Expulsion de**: ${user}\n**Auteur**: ${message.author}\n**Pour**: \`${reason}\`\n**Temps de réponse**: ${client.ws.ping}ms`)
            .setDescription(`${message.author} a **kick** ${user.user} pour \`${reason}\``)  
          ) 
          }}
} else {

}

    }
}