const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")

module.exports = {
    name: 'banlist',
    aliases: ["ban list"],
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
            message.guild.fetchBans()
        
            .then(async bans => {
      
              let p0 = 0;
              let p1 = 30;
              let page = 1;
              let ie = 0; 
              const obj = bans.map(m => ({
                user: ``
              }));
              const bList = Array.from(obj);
              if (bList.length < 1) return message.channel.send(new Discord.MessageEmbed().setColor(color).setTitle("Aucun ban en cours"))
              let tdata = await message.channel.send(new Discord.MessageEmbed().setColor(color).setTitle(`Liste des bannissements du serveur`))
      
                  const embed = new MessageEmbed()
                  embed.setTitle(`Liste des bannissements du serveur`)
                  .setDescription(bans
                      .map(r => r)
                      .map((m,i) => `${m.user}`)
                      .slice(p0, p1)
                       
                      )
                                  .setFooter(`${page}/${Math.ceil(bList.length / 30) || 1} • ${client.user.username}`)  
      
                  .setColor(color)
                               
      
                  let reac1
              
                  let reac3
      
                  if (bList.length > 30) {
                   
                      reac1 = await tdata.react("◀");
                      await sleep(250);
                
                      reac3 = await tdata.react("▶");
                      await sleep(250);
                  }
      
                  tdata.edit(" ", embed);
      
                  const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);
      
                  data_res.on("collect", async (reaction) => {
      
                      if (reaction.emoji.name === "◀") {
      
                          p0 = p0 - 30;
                          p1 = p1 - 30;
                          page = page - 1
      
                          if (p0 < 0) {
                              return
                          }
                          if (p0 === undefined || p1 === undefined) {
                              return
                          }
      
      
                          embed
                          .setDescription(bans
                              .map(r => r)
                              .map((m,i) => `${m.user}`)
                      .slice(p0, p1)
                       
                      )
                                  .setFooter(`${page}/${Math.ceil(bList.length / 30)} • ${client.user.username}`)  
      
                          
                         
                          tdata.edit(embed);
      
                      }
      
                      if (reaction.emoji.name === "▶") {
      
                          p0 = p0 + 30;
                          p1 = p1 + 30;
      
                          page++;
      
                          if (p1 > bList.length  + 30) {
                              return
                          }
                          if (p0 === undefined || p1 === undefined) {
                              return
                          }
      
      
                          embed
                          .setDescription(bans
                              .map(r => r)
                              .map((m,i) => `${m.user}`)
                      .slice(p0, p1)
                       
                      )
                                  .setFooter(`${page}/${Math.ceil(bList.length / 30)} • ${client.user.username}`)  
      
                          
                         
                          tdata.edit(embed);
      
                      }
      
                      
      
                      await reaction.users.remove(message.author.id);
      
                  })
                
                })
} else {

}

    }
}