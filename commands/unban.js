const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'unban',
    aliases: ["ub"],
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
          
      
            if(args[0] == "all") {
                try {
              message.guild.fetchBans().then(bans => {
                if (bans.size == 0) {
                    message.channel.send("Aucune personne n'est ban.")
                } else {
                    bans.forEach(ban => {
                        setInterval(()=> {if(ban.user) message.guild.members.unban(ban.user.id,  `Unban-all par ${message.author.tag}`).catch(err => {});}, 250)
                       
                    })
                    message.channel.send(`${bans.size} ${bans.size > 1 ? "utilisateurs ont": "utilisateur a"} été unban`);
  
               
                }
                
            }
            )
          } catch (error) {
              return;
          }
            } else if(args[0]) {
                try {
        let user = await client.users.fetch(args[0])
        if(!user) return  message.channel.send(`Aucun membre trouvée pour: \`${args[0]}\``)
    
       let ban = message.guild.fetchBan(user.id)
       if(!ban) return message.channel.send(`Aucun membre banni trouvée pour: \`${args[0]}\``)
        message.guild.members.unban(user.id, `Unban par ${message.author.tag}`)
     message.channel.send(`${user.tag} n'est plus banni`);
           
           
            
  } catch (error) {
      return;
  }
      }
} else {

}

    }
}