const db = require('quick.db')

module.exports = {
name: 'status',
aliases: ["config"],
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

    let soutien = db.get(`role.${message.guild.id}`)
    if(soutien === null) soutien = "`None`"  
    let role = message.guild.roles.cache.get(soutien)
    if(!role) soutien = "`None`"  
    let msg = db.get(`message.${message.guild.id}`)
    if(!msg) soutien = "`None`"  
    if(soutien && msg && role) soutien = `\`${msg}\` ${role}`

    if (args > 3) return message.reply("Vous ne pouvez mettre que 2 mots")
    if (!args[0]) return message.reply("Utilisez la commande de cette façon: `"+prefix+"status <role id> <status>` ou `"+prefix+"status <on/off>`")

    const serv = message.guild.id
    const roole = args[0]
    const msgg = args.slice(1).join(' ');

    if (args[0] == "off"){
        const cc = db.get(`soutiens.${message.guild.id}`)
        if (cc == "off") return message.channel.send("Le soutiens est déjà désactiver")
        else { message.channel.send("Le soutiens a été désactiver")
               db.set(`soutiens.${message.guild.id}`, "off")}
    }
    else if(args[0] == "on"){
            const cc = db.get(`soutiens.${message.guild.id}`)
            if(cc == "on") return message.channel.send("Le soutiens est déjà activer")
            else { message.channel.send("Le soutiens a été activé")
            db.set(`soutiens.${message.guild.id}`, "on")}
        }
        else {
            if (!args[1]) return message.reply("Utilisez la commande de cette façon: `"+prefix+"status <role id> <status>` ou `"+prefix+"status <on/off>`")
            db.set(`role.${message.guild.id}`, roole)
            db.set(`message.${message.guild.id}`, msgg)
            db.set(`serv`, serv)
            message.reply("Status rôle mis avec succès")
            message.channel.send(`>>> Serveur: ${serv}\nRôle: ${roole}\nMessage: ${msgg}`)
        }
    


}
}
}