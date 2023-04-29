
const Discord = require("discord.js");
const interaction = {}
      const { MessageEmbed } = require("discord.js")
const db = require('quick.db')
const { MessageActionRow, MessageButton } = require('discord-buttons');
module.exports = {
    name: 'rolemenu',
    aliases: [],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true) {
 
            dureefiltrer = response => { return response.author.id === message.author.id };

           const msgembed = new MessageEmbed()
   
            msgembed.setTitle(`Rolemenu`)
            msgembed.setColor(color)
            msgembed.addField(`Salon`, `${!message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) ? message.channel:`<#${db.get(`rolemenusalon_${message.guild.id}`)}>` }`, true)
            msgembed.addField(`Message`, `${db.get(`rolemenumsg_${message.guild.id}`) ?db.get(`rolemenumsg_${message.guild.id}`):"Le dernier du salon" }`, true)
            msgembed.addField(`Rôles donnés`, `${!message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "None":`${db.get(`rolemenuemoji_${message.guild.id}`)}`}${message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "・<@&"+message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))+">":""}`, true)

           const B3 = new MessageButton()
           .setStyle('blurple')
           .setID('salon')
           .setLabel('🏷️')
           const B2 = new MessageButton()
           .setStyle('blurple')
           .setID('tt')
           .setLabel('💬')
        const B1 = new MessageButton()
        .setStyle('blurple')
        .setID('autorole')
        .setLabel('👤')
        const B4 = new MessageButton()
        .setStyle('blurple')
        .setID('yes')
        .setLabel('✅')
    
  

        const interactiveButtons = new MessageActionRow()
        .addComponent(B1)
        .addComponent(B2)
        .addComponent(B3)
        .addComponent(B4)



    const msg = await message.channel.send({ components: [interactiveButtons], embed: msgembed });
    interaction.message = msg;
    interaction.duration = 60 * 1000;
    interaction.interactor = message.author;
    interaction.buttonStartTime = Date.now();
    interaction.components = interactiveButtons;
    client.on('clickButton', async (button) => {
        if (interaction.interactor !== button.clicker.user || Date.now - interaction.buttonStartTime >= interaction.duration || button.message.id !== interaction.message.id) return;
        if (button.id == 'autorole') {
            message.channel.send(`Envoyez le **rôle** à ajouter`).then(mp => {
                mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                    if(cld.first().content === "delete") {
               db.set(`rolemenurole_${message.guild.id}`, null)
               db.set(`rolemenuemoji_${message.guild.id}`,null)

          cld.first().delete()
        mp.delete()       
        const end = new MessageEmbed()
   
        end.setTitle(`Rolemenu`)
        end.setColor(color)
        end.addField(`Salon`, `${!message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) ? message.channel:`<#${db.get(`rolemenusalon_${message.guild.id}`)}>` }`, true)
        end.addField(`Message`, `${db.get(`rolemenumsg_${message.guild.id}`) ?db.get(`rolemenumsg_${message.guild.id}`):"Le dernier du salon" }`, true)
        end.addField(`Rôles donnés`, `None`, true)
       
       interaction.message.edit("",{ embed: end,components: [interaction.components] });
               
                        return;
                    } else if(cld.first().content === "cancel") {
                        cld.first().delete()
                      mp.delete()       
                 
                                      return;
                    } 
                    var msg = cld.first();
                    let role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content)
                    if(!role) return  message.channel.send(`Aucun rôle trouvé pour \`${msg.content}\``);
                    message.channel.send(`Envoyez l'**émoji** à utiliser pour le rôle ${role.name}`).then(mpe => {
                        mpe.channel.awaitMessages(dureefiltrer, { max: 1, time: 60000, errors: ['time'] })
                        .then(cld2 => {

                var msg2 = cld2.first();
                let emoji = Discord.Util.parseEmoji(msg2.content)
                if(!emoji) return  message.channel.send(`Je n'ai pas accès à cet émoji`);
                cld.first().delete()
                mp.delete()  
                cld2.first().delete()
                mpe.delete()  
                db.set(`rolemenuemoji_${message.guild.id}`,msg2.content)
               db.set(`rolemenurole_${message.guild.id}`, role.id)
               const end = new MessageEmbed()
   
               end.setTitle(`Rolemenu`)
               end.setColor(color)
               end.addField(`Salon`, `${!message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) ? message.channel:`<#${db.get(`rolemenusalon_${message.guild.id}`)}>` }`, true)
               end.addField(`Message`, `${db.get(`rolemenumsg_${message.guild.id}`) ?db.get(`rolemenumsg_${message.guild.id}`):"Le dernier du salon" }`, true)
               end.addField(`Rôles donnés`, `${msg2.content}・<@&${role.id}>`, true)
                            
              interaction.message.edit("",{ embed: end,components: [interaction.components] });

                })})   });
                })
            button.reply.defer(true);
        }  
        if (button.id == 'yes') {
            let channel = message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) || message.channel
            channel.messages.fetch(db.get(`rolemenumsg_${message.guild.id}`)).then(async msg => {
                let role = message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))

                let emoji = Discord.Util.parseEmoji(db.get(`rolemenuemoji_${message.guild.id}`));
if(!channel) return message.channel.send(`Aucun **salon** valide n'est configuré !`).then(msgeee => msgeee.delete({ timeout: 2500, reason: '' }));
if(!msg) return message.channel.send(`Aucun **message** valide n'est configuré !`).then(msgeee => msgeee.delete({ timeout: 2500, reason: '' }));
if(!role) return message.channel.send(`Aucun **rôle** valide n'est configuré !`).then(msgeee => msgeee.delete({ timeout: 2500, reason: '' }));
if(!emoji) return message.channel.send(`Aucune **réaction** valide n'est configuré !`).then(msgeee => msgeee.delete({ timeout: 2500, reason: '' }));
message.channel.send(`Menu crée`).then(msgeee => msgeee.delete({ timeout: 2500, reason: '' }));

msg.react(db.get(`rolemenuemoji_${message.guild.id}`))
db.push(`reactions_${message.guild.id}_${msg.id}`, {
emoji: db.get(`rolemenuemoji_${message.guild.id}`),
roleId: role.id
})})
             ;
button.reply.defer(true);
        
        }
            if (button.id == 'salon') {
                message.channel.send(`Quel est le **salon** du rolemenu ?`).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 60000, errors: ['time'] })
                    .then(cld => {
                        if(cld.first().content === "delete") {
                   db.set(`rolemenusalon_${message.guild.id}`, null)
              cld.first().delete()
            mp.delete()       
            const end = new MessageEmbed()
       
            end.setTitle(`Rolemenu`)
            end.setColor(color)
            end.addField(`Salon`, `${message.channel}`, true)
            end.addField(`Message`, `${db.get(`rolemenumsg_${message.guild.id}`) ?db.get(`rolemenumsg_${message.guild.id}`):"Le dernier du salon" }`, true)
            end.addField(`Rôles donnés`, `${!message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "None":`${db.get(`rolemenuemoji_${message.guild.id}`)}`}${message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "・<@&"+message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))+">":""}`, true)
           
           interaction.message.edit("",{ embed: end,components: [interaction.components] });
                   
                            return;
                        } else if(cld.first().content === "cancel") {
                            cld.first().delete()
                          mp.delete()       
                     
                                          return;
                        } 
    
    
                    var msg = cld.first();
                    let role = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                    if(!role) return  message.channel.send(`Aucun salon trouvé pour \`${msg.content}\``);
                    cld.first().delete()
                    mp.delete()  
                   db.set(`rolemenusalon_${message.guild.id}`, role.id)
                   const end = new MessageEmbed()
       
                   end.setTitle(`Rolemenu`)
                   end.setColor(color)
                   end.addField(`Salon`, `${role}`, true)
                   end.addField(`Message`, `${db.get(`rolemenumsg_${message.guild.id}`) ?db.get(`rolemenumsg_${message.guild.id}`):"Le dernier du salon" }`, true)
                   end.addField(`Rôles donnés`, `${!message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "None":`${db.get(`rolemenuemoji_${message.guild.id}`)}`}${message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "・<@&"+message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))+">":""}`, true)
                                
                  interaction.message.edit("",{ embed: end,components: [interaction.components] });
    
                    });
                    });
                button.reply.defer(true);
            
        }    if (button.id == 'tt') {
            message.channel.send(`Envoyez l'**ID** du message à utiliser`).then(mp => {
                mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                    if(cld.first().content === "delete") {
               db.set(`rolemenumsg_${message.guild.id}`, null)
          cld.first().delete()
        mp.delete()       
        const end = new MessageEmbed()
   
        end.setTitle(`Rolemenu`)
        end.setColor(color)
        end.addField(`Salon`, `${!message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) ? message.channel:`<#${db.get(`rolemenusalon_${message.guild.id}`)}>` }`, true)
        end.addField(`Message`, `Le dernier du salon`, true)
        end.addField(`Rôles donnés`, `${!message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "None":`${db.get(`rolemenuemoji_${message.guild.id}`)}`}${message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "・<@&"+message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))+">":""}`, true)
       
       interaction.message.edit("",{ embed: end,components: [interaction.components] });
               
                        return;
                    } else if(cld.first().content === "cancel") {
                        cld.first().delete()
                      mp.delete()       
                 
                                      return;
                    } 


                var msg = cld.first();
                let role = message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) || message.channel
                var rolee =  role.messages.fetch(msg.content);
                if(!rolee) return  message.channel.send(`Aucun message trouvé pour \`${msge.content}\`.`);
                cld.first().delete()
                mp.delete()  
               db.set(`rolemenumsg_${message.guild.id}`, role.id)
               const end = new MessageEmbed()
   
               end.setTitle(`Rolemenu`)
               end.setColor(color)
               end.addField(`Salon`, `${!message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) ? message.channel:`<#${db.get(`rolemenusalon_${message.guild.id}`)}>` }`, true)
               end.addField(`Message`, `${msg.content}`, true)
               end.addField(`Rôles donnés`, `${!message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "None":`${db.get(`rolemenuemoji_${message.guild.id}`)}`}${message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`)) ? "・<@&"+message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))+">":""}`, true)
                            
              interaction.message.edit("",{ embed: end,components: [interaction.components] });

                });
                });
            button.reply.defer(true);
        }  
    })

      

        } else {

        }
    }
}