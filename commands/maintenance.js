const db = require("quick.db");
const Discord = require("discord.js");
module.exports = {
  name: "maintenance",
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
      message.channel.send(`Tu dois écrire \`${prefix}maintainence on/off\``)
    }
if (args[0] == "on") 

    {
      let ont = db.fetch(`maintain_${message.guild.id}`);
    if(ont == "on")
    {
      message.channel.send("La maintenance est déjà activée")
      return;
    }
    let on2 = "on";
db.set(`maintain_${message.guild.id}`, on2);
        message.guild.channels.cache.forEach(ch => 
{
 ch.overwritePermissions([
  {
     id: message.guild.roles.everyone.id,
     deny: ['VIEW_CHANNEL'],
  },
], `${message.member.id} a acitvé la maintenance `);
}) 
message.guild.channels.create('tempo chat', { //Create a channel
            type: 'text', //Make sure the channel is a text channel
            permissionOverwrites: [{ //Set permission overwrites
                id: message.guild.roles.everyone.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            }]
        });
        message.guild.channels.create('tempo voc', { //Create a channel
            type: 'voice', //Make sure the channel is a text channel
            permissionOverwrites: [{ //Set permission overwrites
                id: message.guild.roles.everyone.id,
                allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'],
            }]
        });
message.channel.send(`Le serveur a été mis sous mainteenance`)
    }
    if (args[0] == "off") 
    {

let offt = db.fetch(`maintain_${message.guild.id}`);
    if(offt == "off")
    {
      message.channel.send("La maintenance est déjà désactivée")
      return;
    }
    let off2 = "off";
db.set(`maintain_${message.guild.id}`, off2);
        message.guild.channels.cache.forEach(ch => 
{
 ch.overwritePermissions([
  {
     id: message.guild.roles.everyone.id,
     allow: ['VIEW_CHANNEL'],
  },
], `${message.member.id} a enlever la maintenance`);
}) 
message.guild.channels.cache.find(channel => channel.name === "tempo-chat").delete("Maintainence mode off");
message.guild.channels.cache.find(channel => channel.name === "tempo voc").delete("Maintainence mode off");


message.channel.send(`La maintenance est maintenant enlevée`)
    }



}
}
}