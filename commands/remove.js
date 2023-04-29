const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')

module.exports = {
name: 'remove',
aliases: [],
run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color

  
if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true) {

if(args[0] === "activity") {
    client.user.setPresence({ activity: null })
    .then(p => message.channel.send(`Activité supprimée`))
    .catch(e => { return message.channel.send(`Une erreur a été rencontré.`); });
    const streamm = db.delete(`stream`)
    const playy = db.delete(`play`)
    const watchh = db.delete(`wtach`)
    const listenn = db.delete(`listen`)
} else {
    
}

} else {

}

}
}