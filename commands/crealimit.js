const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: 'creation limit',
    aliases: ["crea"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
      
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
        if(args[0] === "limit") {
            if(args[1]) {
                if(!args[1].endsWith("d") && !args[1].endsWith("j") && !args[1].endsWith("h") && !args[1].endsWith("m")  && !args[1].endsWith("s")) return message.channel.send(`Format incorrect : essayez \`${prefix}creation limit 3j\``)

db.set(`crealimit_${message.guild.id}`, args[1])
message.channel.send(`Les membres ne pourront pas rejoindre si leur compte a été créé il y a moins de ${args[1]}`)
            }
        }  else {

        }

        } else {

        }
    }
}