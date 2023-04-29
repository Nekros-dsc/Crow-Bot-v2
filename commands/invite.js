const db = require('quick.db')
const Discord = require('discord.js')

module.exports = {
name: 'invite',
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

if (!args[0]) return message.reply("il vous fait un id de serveur")
    const guild = client.guilds.cache.get(args[0])
    if(!guild) return
        const embed = new Discord.MessageEmbed()
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTitle("Serveur!")
            .addField("Nom du serveur", guild.name, true)
            .addField("ID Du serveyr", guild.id, true)
            .addField("Owner du serveur", guild.ownerID, true)
            .addField("Ping Owner", `<@${guild.ownerID}>`, true)
            .addField("Membres", guild.memberCount, true)
    
            await guild.channels.cache
            .first()
            .createInvite()
            .then((invite) => embed.addField("Lien d'invitation", invite.url, true))
            .catch(() => embed.addField("Lien d'invitation", "Permission Invalides", true));
    
        message.channel.send(embed);

}
}
}
