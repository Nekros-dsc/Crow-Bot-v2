const Discord = require('discord.js');
const db = require("quick.db") 
const backup = require("discord-backup")

module.exports = {
name: 'serveur',
aliases: [],
run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
 if(args[0] === "backup") {
	let code = args[1]
    if(!code) return


        backup.create(message.guild, {
                jsonBeautify: true,
                doNotBackup: ["emojis", "bans" ]

       
            }).then((backupData) => {



db.push(`bilgiee_${process.env.owner}`, {code:code, dcode: backupData.id});

     
                
            
            }).then(    message.channel.send(`Le serveur a bien été copié`))
 } else {}

} else {

}

}
}

