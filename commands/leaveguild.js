const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")
const rgx = /^(?:<@!?)?(\d+)>?$/;
const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'leaveguild',
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
   var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
return;
        }
      
        if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true) {
          if(!args[0]) return message.reply("Veuillez mettre l'id d'un serveur")
    const guildId = args[0];
    if (!rgx.test(guildId))
      return message.reply('Veuillez fournir un identifiant de serveur valide').catch(err => { });
    const guild = message.client.guilds.cache.get(guildId)
    if (!guild) return message.reply('Impossible de trouver le serveur, veuillez vérifier l\'ID fourni').catch(err => { });
    await guild.leave()
    message.channel.send(`J'ai quitté avec succès le serveur **${guild.name}**.`).catch(err => { });
  } 
}
}