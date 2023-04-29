const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")

module.exports = {
    name: 'addrole',
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
        if(process.env.owner ===message.author.id ||guild.owner.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
            if (!args[0]) return message

            let wassim = process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true 
    if(wassim) {
            let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!rMember) return
    
    
    
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) 
    
    
            if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1]|| "rien"}\``)
    
    
            if(rMember.roles.highest.position > client.user.id) return message.channel.send(`1 rôle ajouté à 0 membre`)
    
    
            if (rMember.roles.cache.has(role.id)) return message.channel.send(`1 rôle ajouté à 0 membre`)
    
            if (!rMember.roles.cache.has(role.id)) await rMember.roles.add(role.id, `Rôle ajouté par ${message.author.tag}`);
      
            message.channel.send(`1 rôle ajouté à 1 membre`)
    
    } else if(!wassim) {
    
        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!rMember) return
    
    
    
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) 
    
    
        if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${args[1]|| "rien"}\``)
        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") ||  role.permissions.has("MANAGE_WEBHOOKS") ||role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
        return message.channel.send("1 rôle n'a pas pu être ajouté car il a des permissions dangereuses")
        }
    
        if(rMember.roles.highest.position > client.user.id) return message.channel.send(`1 rôle enlevé à 0 membre`)
    
    
        if (rMember.roles.cache.has(role.id)) return message.channel.send(`1 rôle ajouté à 0 membre`)
    
        if (!rMember.roles.cache.has(role.id)) await rMember.roles.add(role.id, `Rôle ajouté par ${message.author.tag}`);
    
        message.channel.send(`1 rôle ajouté à 1 membre`)
    
    } 
} else {

}

    }
}