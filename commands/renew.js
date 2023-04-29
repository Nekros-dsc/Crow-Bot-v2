const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'renew',
    aliases: ["nuke"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
 
      
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true) {
            if(args[0] === "all") {
                const channels = message.channel.guild.channels.cache.filter(ch => ch.type !== 'category');
    
                channels.forEach(async channele => {
                    await channele.clone({
                        name: channele.name,
                        permissions: channele.permissionsOverwrites,
                        type: channele.type,
                        topic: channele.withTopic,
                        nsfw: channele.nsfw,
                        birate: channele.bitrate,
                        userLimit: channele.userLimit,
                        rateLimitPerUser: channele.rateLimitPerUser,
                        permissions: channele.withPermissions,
                        position: channele.rawPosition,
                        reason:  `Tout les salon recréé par ${message.author.tag} (${message.author.id})`
                    })
                    .catch(err => {})
                    channele.delete().catch(err => {})  })
                
    
            
             
               
            } else {
             
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel 
    if(channel === message.channel) {
        try {
            let ee =    await channel.clone({
                name: channel.name,
                permissions: channel.permissionsOverwrites,
                type: channel.type,
                topic: channel.withTopic,
                nsfw: channel.nsfw,
                birate: channel.bitrate,
                userLimit: channel.userLimit,
                rateLimitPerUser: channel.rateLimitPerUser,
                permissions: channel.withPermissions,
                position: channel.rawPosition,
                reason:  `Salon recréé par ${message.author.tag} (${message.author.id})`
            })
            channel.delete() 
            ee.send(`${message.author} salon recréé`)
        } catch (error) {
            return;
        }
    } else {
    
        try {
          let ee =  await channel.clone({
                name: channel.name,
                permissions: channel.permissionsOverwrites,
                type: channel.type,
                topic: channel.withTopic,
                nsfw: channel.nsfw,
                birate: channel.bitrate,
                userLimit: channel.userLimit,
                rateLimitPerUser: channel.rateLimitPerUser,
                permissions: channel.withPermissions,
                position: channel.rawPosition,
                reason:  `Salon recréé par ${message.author.tag} (${message.author.id})`
            })
            channel.delete() 
            ee.send(`${message.author} salon recréé`)
    
        } catch (error) {
            return;
        }
       
        message.channel.send("Salon recréé : "+channel.name)
    }
           
    
    }
      
} else {

}

    }
}