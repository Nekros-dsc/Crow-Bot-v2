const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')

module.exports = {
name: 'settings',
aliases: ["config"],
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


if(!args[0]) {

let logmsg = message.guild.channels.cache.get(db.get(`${message.guild.id}.msglog`))
if(!logmsg) logmsg = "`off`"
let logvc = message.guild.channels.cache.get(db.get(`${message.guild.id}.logvc`))
if(!logvc) logvc = "`off`"
let logmod = message.guild.channels.cache.get(db.get(`${message.guild.id}.logmod`))
if(!logmod) logmod = "`off`"

let antilink = db.get(`link_${message.guild.id}`)
if(antilink === null) antilink = "off"  
if(antilink === true) antilink = "on"
let antilinktype = db.get(`typelink_${message.guild.id}`)
if(antilinktype === null) antilinktype = "" 
let soutien = db.get(`role.${message.guild.id}`)
if(soutien === null) soutien = "`None`"  
let role = message.guild.roles.cache.get(soutien)
if(!role) soutien = "`None`"  
let msg = db.get(`message.${message.guild.id}`)
if(!msg) soutien = "`None`"  
if(soutien && msg && role) soutien = `\`${msg}\` ${role}`
let soutienoff = db.get(`soutiens.${message.guild.id}`)
if(soutienoff === "off") soutien = "`off`"
let antieveryone = db.get(`everyone_${message.guild.id}`)
if(antieveryone === null) antieveryone = "off"  
if(antieveryone === true) antieveryone = "on"
let antispam = db.get(`antispam_${message.guild.id}`)
if(antispam === null) antispam = "off"  
if(antispam === true) antispam = "on"
let public = db.get(`public_${message.guild.id}`)
if(public === null) public = "off"  
if(public === true) public = "on"
const piconly = db.get(`piconlymap.${message.guild.id}`)

const embed = new Discord.MessageEmbed()
.setTitle('**SETTINGS**')
.setDescription(`**Prefix :** \`${prefix}\`\n**Clear limit :** \`100\`\n**Log des messages :** ${logmsg}\n**Log voice :** ${logvc}\n**Log de modération :** ${logmod}\n**Antispam :** \`${antispam} 5 /5s\`\n**Antilink :** \`${antilink}${antilinktype}\`\n**Antimassmention :** \`${antieveryone} 3\`\n**Public :** \`${public}\`\n**Soutien :** ${soutien}`)
.setColor(color)

  .setFooter(`${client.user.username}`)

  return message.channel.send(embed)
}



} else {

}

}
}