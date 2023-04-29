
const Discord = require("discord.js");
const interaction = {}
      const { MessageEmbed } = require("discord.js")
const db = require('quick.db')
const { MessageActionRow, MessageButton } = require('discord-buttons');
module.exports = {
    name: 'sanctions',
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
            let user;
            if(!args[0]) user = message.author
            if(args[0] && isNaN(args[0])) user = message.mentions.users.first()
            if(args[0] && !isNaN(args[0])){
                user = client.users.cache.get(args[0])
         
                if(!message.guild.members.cache.has(args[0])) return message.channel.send(`Aucun membre trouvé pour \`${args[0] || "rien"}\``)
         
            }
        
            if(!user) return message.channel.send(`Aucun membre trouvé pour \`${args[0]}\``)
        
            const number = db.fetch(`number.${message.guild.id}.${user.id}`)
            const warnInfo = db.fetch(`info.${message.guild.id}.${user.id}`)
        
        if(!number || !warnInfo || warnInfo == []) return message.channel.send(`Aucun membre trouvé avec des sanctions pour \`${args[0] || "rien"}\``)
        let p0 = 0;
        let p1 = 5;
        let page = 1;
        

        let tdata = await message.channel.send("Chargement")

            const embed = new MessageEmbed()
            embed.setTitle(`Liste des sanctions de ${user.tag} (**${number}**)`)
            .setDescription(warnInfo
            .map(r => r)
            .map((m,i) => `${i+1}・\`${m.id}\`\nModérateur: \`${m.moderator}\`\n Raison: \`${m.reason}\`\nDate: <t:${m.date}>`)
                .slice(p0, p1)
                 
                )
                .setFooter(`${page}/${Math.ceil(number / 5)}`)  
            .setColor(color)

            let reac1
            let reac2
            let reac3

            if (number > 5) {
             
                reac1 = await tdata.react("⬅");
                await sleep(250);
                reac2 = await tdata.react("❌");
                await sleep(250);
                reac3 = await tdata.react("➡");
                await sleep(250);
            }

            tdata.edit(" ", embed);

            const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

            data_res.on("collect", async (reaction) => {

                if (reaction.emoji.name === "⬅") {

                    p0 = p0 - 5;
                    p1 = p1 - 5;
                    page = page - 1

                    if (p0 < 0) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed
                    .setDescription(warnInfo
                       .map(r => r)
                              .map((m,i) => `${i+1}・\`${m.id}\`\nModérateur: \`${m.moderator}\`\n Raison: \`${m.reason}\`\nDate: <t:${m.date}>`)

                       .slice(p0, p1)
                         
                        ).setFooter(`${page}/${Math.ceil(number / 5)}`)  
                    
                   
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 5;
                    p1 = p1 + 5;

                    page++;

                    if (p1 > number + 5) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed
                    .setDescription(warnInfo
                        .map(r => r)
                               .map((m,i) => `${i+1}・\`${m.id}\`\nModérateur: \`${m.moderator}\`\n Raison: \`${m.reason}\`\nDate: <t:${m.date}>`)

                        .slice(p0, p1)
                         
                        ).setFooter(`${page}/${Math.ceil(number / 5)}`)  
                    
                   
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    reac1.remove()
                    reac2.remove()
                    return reac3.remove()
                }

                await reaction.users.remove(message.author.id);

            })
        }
    }
}