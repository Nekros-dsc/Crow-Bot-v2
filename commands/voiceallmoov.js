const db = require("quick.db")
module.exports = {
    name: "voicemove",
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
      let args1 = args.slice(1).join(' ');
      if(!args1)
      {
        message.channel.send("Tu ne m'as pas donner l'id du salon")
      }
     
     const vc1 = args[1]
    const channel = message.member.voice.channel;
     for (let member of channel.members) {
              member[1].voice.setChannel(vc1)
          }
  message.channel.send(`Tout le monde a été moov dans <#${args1}>`);
    }
}
    
    }