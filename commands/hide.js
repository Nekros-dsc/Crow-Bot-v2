const db = require("quick.db");
const Discord = require("discord.js")
module.exports = {
  name: "hide",
  aliases: [],
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
    

    let content = args[0];
  
   message.channel.overwritePermissions([
  {
     id: message.guild.roles.everyone.id,
     deny: ['VIEW_CHANNEL'],
  },
], `${message.member.id} a vérouiller le serveur`);
message.channel.send("Le salon est invisible :thumbsup:")

}
}}