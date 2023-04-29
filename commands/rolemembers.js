const Discord = require("discord.js")
const {MessageEmbed} = require("discord.js")

const db = require("quick.db")
const ms = require("ms")

module.exports = {
    name: 'rolemembers',
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
            let tdata = await message.channel.send(new MessageEmbed().setColor(color).setTitle(`Liste des admins présents`))

        let p0 = 0;
        let p1 = 30;
        let page = 1;
        let ie = 0; 
if (!args[0]) return message.reply("veuillez donner un id/nom de rôle")
const rolee = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        var str_filtrer = (message.member.roles.cache.some(role => role.name === rolee))
        if(str_filtrer.size === 0 || undefined || false || null) return message.channel.send(new Discord.MessageEmbed().setColor(color).setTitle("Aucun membre"))

            const embed = new MessageEmbed()
            embed.setTitle(`Liste des membres avec le rôle`)
            .setDescription(str_filtrer
                  .map(r => r)
            .map((m,i) => `${i+1} - ${m.user.username} : ${m.user.id}`)
                .slice(p0, p1)
                )
                
            .setColor(color)
            .setFooter(`Total: ${str_filtrer.size} • ${client.user.username}`)
             

            let reac1
            let reac2
            let reac3

            if (str_filtrer.size > 30) {
             
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
                    .setDescription(str_filtrer
                   .map(r => r)
            .map((m,i) => `${i+1} - ${m.user.username} : ${m.user.id}`)
                .slice(p0, p1)
                )
                .setFooter(`Total: ${str_filtrer.size} • ${client.user.username}`)

                   
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "▶") {

                    p0 = p0 + 30;
                    p1 = p1 + 30;

                    page++;

                    if (p1 > str_filtrer.size + 30) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed
                    .setDescription(str_filtrer
                   .map(r => r)
            .map((m,i) => `${i+1} - ${m.user.username} : ${m.user.id}`)
                .slice(p0, p1)
                )
                    
                .setFooter(`Total: ${str_filtrer.size} • ${client.user.username}`)

                    tdata.edit(embed);

                }

          

                await reaction.users.remove(message.author.id);

            })
          
} else {

}

    }
}