const Discord = require('discord.js');
const db = require("quick.db") 
const ms = require("ms") 
const backup = require("discord-backup")

module.exports = {
name: 'load',
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
if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true) {
    if(args[0] === "emoji") {

 if(args[1] === "backup") {
    let timeout = 2400000;
    let daily = await db.fetch(`guildbackup_${message.guild.id}`);

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = ms(timeout - (Date.now() - daily));
    
   
      message.channel.send(`Une backup à déjà été charger sur le serveur, re essayer dans ${duration(time)} !`).catch(err => { })
  } else {  
     let code = args[2]
     if(!code ) return
	let pog = db.get(`backups_${message.author.id}`);
    if (pog) {
        let data = pog.find(x => x.code === code)
        if (!data) return
        if (!data.emojis) return
       if (!data.size) return
       message.channel.send(`Chargement de la backup...`).catch(err => { })

        data.emojis.forEach(emote => {
            let emoji = Discord.Util.parseEmoji(emote);
            if (emoji.id) {
                const Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${
                    emoji.animated ? 'gif' : 'png'
                }`;
                message.guild.emojis
                    .create(`${Link}`, `${`${emoji.name}`}`)
                    .catch(error => {
                                          });
            }
        }).catch(err => { });

        db.set(`guildbackup_${message.guild.id}`, Date.now())
        let guild = message.guild
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        if (channel) {
            await channel.send(`${message.author} Backup chargée`).catch(err => { })
        }
        message.channel.send(`Backup d'émoji chargée ${data.size ||0}/${data.size ||0}`).catch(err => { });
    } }
	
		
 } 
    } if(args[0] === "serveur") {

        if(args[1] === "backup") {
            let guild = message.guild
            let timeout = 2400000;
                let daily = await db.fetch(`guildbackup_${message.guild.id}`);

                if (daily !== null && timeout - (Date.now() - daily) > 0) {
                  let time = ms(timeout - (Date.now() - daily));
                
               
                  message.channel.send(`Une backup à déjà été charger sur le serveur, re essayer dans ${duration(time)} !`).catch(err => { })
              } else {  
                let code = args[2]
                if(!code ) return
                let pog = db.get(`bilgiee_${process.env.owner}`);
                if (pog) {
                    let data = pog.find(x => x.code === code)
                    if (!data) return 

                backup.fetch(data.dcode).then(() => {

                    backup.load(data.dcode, message.guild).then(async () => {
                        db.set(`guildbackup_${message.guild.id}`, Date.now())
                        let guild = message.guild
                        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
                        if (channel) {
                            await channel.send(`${message.author} Backup chargée`).catch(err => { })
                        }
                      })
                }).catch(err => { })
            
            }
              }
        }
        
        }
} else {

}

}
}

function duration(mss) {
    const sec = Math.floor((mss / 1000) % 60).toString()
    const min = Math.floor((mss / (1000 * 60)) % 60).toString()
    const hrs = Math.floor((mss / (1000 * 60 * 60)) % 60).toString()
    const days = Math.floor(mss / (1000 * 60 * 60 * 24)).toString()
    return `${days.padStart(2, '') == "0" ? "" : `**${days.padStart(2, '')}** jours, `}${hrs.padStart(2, '') == "0" ? "" : `**${hrs.padStart(2, '')}** heures, `}${min.padStart(2, '') == "0" ? "" : `**${min.padStart(2, '')}** minutes et `}**${sec.padStart(2, '')}** secondes.`
}