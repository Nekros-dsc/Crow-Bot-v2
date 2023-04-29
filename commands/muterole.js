const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")

module.exports = {
    name: 'muterole',
    aliases: ["mr"],
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
            let Muted = await db.fetch(`mRole_${message.guild.id}`);

            let muterole = await message.guild.roles.cache.get(Muted) || message.guild.roles.cache.find(role => role.name === `muet`) || message.guild.roles.cache.find(role => role.name === `Muted`) || message.guild.roles.cache.find(role => role.name === `Mute`)
        if(muterole) {
            const embed = new Discord.MessageEmbed()
            embed.setColor(color)
            embed.setDescription(`**Il existe déjà un rôle muet : <@&${muterole.id}>**\nVérification des permissions du rôles muet en cours`)
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
            const embed = new Discord.MessageEmbed()
            embed.setColor(color)
            embed.setTitle(`Création d'un rôle muet`)
             message.channel.send(embed).then(async m => {
            muterole = await message.guild.roles.create({
                data: {
                     name: 'muet',
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muterole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }, "Muterole"))
            db.set(`mRole_${message.guild.id}`, `${muterole.id}`)
            const e = new Discord.MessageEmbed()
            e.setColor(color)
            e.setDescription(`***Rôle muet créé :*** ${muterole}`)
            return m.edit("",e)
             })
} else {

}}

    }
}