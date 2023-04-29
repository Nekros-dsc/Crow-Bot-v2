const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms"), 
cooldown = {}
function mutetime(user, time, authorcooldown, muterole) {
    user.roles.add(muterole.id).then(r => {
        authorcooldown.limit++
        setTimeout(() => {
            user.roles.remove(muterole.id)
        }, time);
        setTimeout(() => {
            authorcooldown.limit = authorcooldown.limit - 1
            }, 120000);
        })
};

function mute(user, authorcooldown, muterole) {
    user.roles.add(muterole.id).then(r => {
        authorcooldown.limit++
        setTimeout(() => {
            authorcooldown.limit = authorcooldown.limit - 1
            }, 120000);
        })
};
module.exports = {
    name: 'unmute',
    aliases: ["unm"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
 
      
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
            let chx = db.get(`${message.guild.id}.logmod`);
            const logschannel = message.guild.channels.cache.get(chx)
            if(args[0] === "all"){
                let Muted = await db.fetch(`mRole_${message.guild.id}`);
                      let muteRole = await message.guild.roles.cache.get(Muted) || message.guild.roles.cache.find(role => role.name === `muet`) || message.guild.roles.cache.find(role => role.name === `Muted`) || message.guild.roles.cache.find(role => role.name === `Mute`)
                    if(!muteRole) return message.channel.send(`Je ne trouve pas le rôle **muet**`)
                    if(muteRole.members.size === 0 || undefined || false || null) return message.channel.send(`Tous les membres ont été unmute`)
                  message.channel.send(`Tous les membres ont été unmute`)
                      muteRole.members
                      .forEach((m,i) => {m.send(`Vous avez été **unmute** de ${message.guild.name}`)
                    m.roles.remove(muteRole.id)
                    
                    })
                    
              
              
              } else if(args[0]) {
                        const user = message.mentions.members.first()|| message.guild.members.cache.get(args[0])
                
                        if (!user) {
                          return message.channel.send(`Aucun membre trouvé pour \`${args[0]}\``);
                        }
                        let Muted = await db.fetch(`mRole_${message.guild.id}`);
                        let muterole = await message.guild.roles.cache.get(Muted) || message.guild.roles.cache.find(role => role.name === `muet`) || message.guild.roles.cache.find(role => role.name === `Muted`) || message.guild.roles.cache.find(role => role.name === `Mute`)
                        
                    if(!muterole) return message.channel.send(`Erreur : aucun rôle muet enregistré`)
                        if (user.roles.cache.has(muterole)) {
                          return message.channel.send(`${user} n'était pas mute`);
                        }
                    
                        user.roles.remove(muterole, `Unmute par ${message.author.tag}`)
                    
                        message.channel.send(`${user} a été **unmute**`);
                        db.set(`mute_${message.guild.id}_${message.mentions.users.first().id}`, null)
                        db.set(`mute_${message.guild.id}_${user.id}`, null)

                        user.send(`Vous avez été **unmute** sur ${message.guild.name}`);
              
                  
                        logschannel.send(new Discord.MessageEmbed()
                        .setColor(color)
                        
                        .setDescription(`${message.author} a **unmute** ${user}`)
                        )
                  } else {

                  }
      
} else {

}

    }
}