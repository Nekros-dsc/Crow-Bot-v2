const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")


module.exports = {
    name: 'lock',
    aliases: ["lk"],
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
            try {
                if(args[0] === "all") {
                    message.guild.channels.cache.forEach((channel, id) => {
                        channel.updateOverwrite(message.guild.roles.everyone, {
                          SEND_MESSAGES: false,
                          SPEAK: false,
                          ADD_REACTIONS: false 
                        })
                      }, `Tout les salon fermé par ${message.author.tag}`);
                        
                        
                      
                     message.channel.send(`${message.guild.channels.cache.size} salons fermés`);
        
                 
                } else {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) ||message.channel 
        
                try {
                    message.guild.roles.cache.forEach(role => {
                        channel.createOverwrite(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    }, `Salon fermé par ${message.author.tag}`);
                } catch (e) {
                    console.log(e);
                }
                message.channel.send(`Les membres ne peuvent plus parler dans <#${channel.id}>`);
        
         
        
                }
        
            } catch (error) {
                return;
            }
      
} else {

}

    }
}