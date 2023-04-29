const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')

module.exports = {
name: 'set',
aliases: [],
run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color



    if(!message.guild) return;


    if (args[0] === "name") {
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
        let str_content = args.slice(1).join(" ")
        client.user.setUsername(str_content)
        .then(u => message.channel.send(`Je m'appelle maintenant : ${str_content}`))
        .catch(e => { return message.channel.send(`Je ne peux pas changer de pseudo pour l'instant, veuillez réessayer plus tard`); });
    } else {
    }
} else if (args[0] === "pic") {
    if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
        if(message.attachments.size > 0) { 
            message.attachments.forEach(attachment => {
                client.user.setAvatar(attachment.url)
                .then(u => message.channel.send(`J'ai bien changer de photo de profil`))
                .catch(e => { return message.channel.send(`Je ne peux pas changer de phote de profil pour l'instant, veuillez réessayer plus tard`); });
            });
        } else {
            let str_content = args.slice(1).join(" ")
            if(!str_content) return
                client.user.setAvatar(str_content)
                .then(u => message.channel.send(`J'ai bien changer de photo de profil`))
                .catch(e => { return message.channel.send(`Je ne peux pas changer de phote de profil pour l'instant, veuillez réessayer plus tard`); });
            }} else {
            }
} else if (args[0] === "muterole") { 
   
    if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {

        let muterole = await message.guild.roles.cache.get(args[1]) ||  message.mentions.roles.first()
            if(muterole) {
        const embed = new Discord.MessageEmbed()
        embed.setColor(color)
        embed.setDescription(`**Role muet enregistré : <@&${muterole.id}>**\nVérification des permissions en cours`)
         message.channel.send(embed).then(async mm => {
             const embed2= new Discord.MessageEmbed()
             embed2.setTitle("Les permissions du rôle muet ont été mises à jour")
             embed2.setColor(color)

            const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
channels.forEach(channel => {


            channel.createOverwrite(muterole, {
            SEND_MESSAGES: false,
            CONNECT: false,
            ADD_REACTIONS: false
        }, "Muterole")
        embed2.setDescription(`**__D'autres permission déjà existantes peuvent rendre innefficace le mute pour certains rôles dans les salons suivants :__**\n\n**${channel.name}**\n- ${muterole.name}\n`, true)
embed2.setFooter("Tous les rôles ayant la permissons \"envoyer des messages\" en vert seront insensible au mute")

    })
   
message.channel.send(embed2)
    })
        return;
}
    if(!muterole) {
      return
} else {

}}

}

}
}