const db = require("quick.db");
const Discord = require("discord.js");
module.exports = {
  name: "antiphoto",
  run: async(client, message, args) => {
    let prefix =  db.get(` ${process.env.owner}.prefix`)
    if(prefix === null) prefix = process.env.prefix;
      let color = db.get(`${process.env.owner}.color`) 
       if(color === null  ) color = process.env.color
    var guild = message.guild
            if(!guild.me.hasPermission("ADMINISTRATOR")){
    return;
            }
    
            if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {

    if(!args[0])
    {
      message.channel.send(`Tu dois écrire \`${prefix}antiphoto all/channel\``)
    }
if (args[0] == "all") 

    {

        message.guild.channels.cache.forEach(ch => 
{
 ch.overwritePermissions([
  {
     id: message.guild.roles.everyone.id,
     deny: ['ATTACH_FILES'],
  },
], `${message.member.id} a activé l'anti photos`);
}) 
message.channel.send(`Les membres ne peuvent plus envoyer d'image`)
    }
    if (args[0] == "off") 
    {
        message.guild.channels.cache.forEach(ch => 
{
 ch.overwritePermissions([
  {
     id: message.guild.roles.everyone.id,
     allow: ['ATTACH_FILES'],
  },
], `${message.member.id} a enlever l'anti photo`);
}) 


message.channel.send(`Les membres peuvent envoyer des images dans tous les salons`)
    }
    const channel = message.guild.channels.cache.get(args[0])
    if (args[0] == channel){

        message.guild.channels.cache.forEach(ch => 
            {
                if (ch == channel) return;
             ch.overwritePermissions([
              {
                 id: message.guild.roles.everyone.id,
                 deny: ['ATTACH_FILES'],
              },
            ], `${message.member.id} a activé l'anti photos`);
            message.channel.send(`Les membres ne peuvent plus envoyer d'image à part dans ${channel}`)
            }) 


    }




}
}
}