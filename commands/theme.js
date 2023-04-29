const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")

module.exports = {
    name: 'theme',
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
            if (!args[0]) return message.reply('veuillez donner une couleur (RANDOM WHITE BLACK etc...)')

            if (args[0] == "RED" || "BLACK" || "RANDOM" || "BLUE" || "PURPLE" || "WHITE" || "GREY" || "ORANGE" || "GREEN" || "YELLOW"){
                db.set(`${process.env.owner}.color`, args[0])
                message.channel.send('Le thème à changer')
            }
            else {
                message.reply('La couleur doit être écrite en majuscule et doit faire partie d\'une des couleurrs listés:```RANDOM\nRED\nBLACK\nBLUE\nPURPLE\nWHITE\nGREY\nORANGE\nGREEN\nYELLOW```')
            }
}

    }
}