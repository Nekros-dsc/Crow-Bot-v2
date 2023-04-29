const db = require("quick.db");
const Discord = require("discord.js")
module.exports = {
  name: "autorole",
  aliases: ["ar", "auto-role"],
  run: async(client, message, args) => {
     if (message.member.hasPermission("MANAGE_SERVER")) {
      if (message.content.includes("@everyone")) {
        return message.reply("Everyone is already automatically given by discord");
      }
    
if(!args[0])
{
  return message.reply("Tu ne m'as pas donner le rôle des personnes qui rejoignent");
}
  var role1 = message.mentions.roles.first().id;
    if(!role1)
    {
      var role1 = args[0];
    }
if(args[0] == "off")
{
 
  db.delete(`autorole_${message.guild.id}`);
  return message.reply("L'autorole a été enlever");
}
else {
message.reply(`Je vais donner le rôle aux nouveaux - ${role1}`)
db.set(`autorole_${message.guild.id}`, role1);
}
     }
  }
}