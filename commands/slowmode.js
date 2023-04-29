
const Discord= require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
name: 'slowmode',
aliases: [],
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
        const currentCooldown = message.channel.rateLimitPerUser;
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel 
        
        
        
        
        if (args[0] === 'off') {
        
            if (currentCooldown === 0) return message.channel.send(`Le mode lent est maintenant désactiver dans <#${channel.id}>`)
        
          
            return message.channel.setRateLimitPerUser(0)
        
        }
        
        const time = ms(args[0]) / 1000;
        
        if (isNaN(time)) return message.channel.send(`Aucune heure valide trouvé pour \`${args[0]}\``)
        
        if (time >= 21600) return message.channel.send('Le mode lent ne peut pas être supérieur à 6h')
        
        if (currentCooldown === time) return message.channel.send(`Mod lent déjà défini sur ${args[0]} dans <#${channel.id}>`);
        
        
        message.channel.setRateLimitPerUser(time).then(m => m.send(`Le mode lent est maintenant de ${args[0]} dans <#${channel.id}>`));
        
} else {

}

}
}
