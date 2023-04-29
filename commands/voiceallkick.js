const db = require("quick.db")
module.exports = {
    name: "cleanup",
    aliases: [],
    run: async(client, message, args, data) => {
        let prefix =  db.get(` ${process.env.owner}.prefix`)
        if(prefix === null) prefix = process.env.prefix;
          let color = db.get(`${process.env.owner}.color`) 
           if(color === null  ) color = process.env.color
        var guild = message.guild
                if(!guild.me.hasPermission("ADMINISTRATOR")){
        return;
                }
        
                if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
    let channel = message.member.voice.channel;
          for (let member of channel.members) {
              member[1].voice.setChannel(null)
          }
          message.channel.send("Toutes les personnes en voc sont kick")
    }
      }
    }