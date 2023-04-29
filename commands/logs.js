const Discord = require('discord.js')
const db = require('quick.db')
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
module.exports = {
    name: 'logs',
    aliases: [],
    run: async (client, message, args) => {

        let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color

        function updateembed(msg) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Configuration Logs`)
            .setColor(color)
            .addField("Logs Mods", message.guild.channels.cache.get(db.get(`${message.guild.id}.logmod`)) ?   `<#${db.get(`${message.guild.id}.logmod`)}> (${db.get(`${message.guild.id}.logmod`)})`:":x:")
            .addField("Logs Message", message.guild.channels.cache.get(db.get(`${message.guild.id}.msglog`)) ?   `<#${db.get(`${message.guild.id}.msglog`)}> (${db.get(`${message.guild.id}.msglog`)})`:":x:")
            .addField("Logs Vocal",message.guild.channels.cache.get( db.get(`${message.guild.id}.logvc`)) ?   `<#${db.get(`${message.guild.id}.logvc`)}> (${db.get(`${message.guild.id}.logvc`)})`:":x:")



        let menuoptions = [
            { value: "Modifier le salon de logs mods", description: "", emoji: "🏷️" },
            { value: "Supprimer le salon de logs mods", description: "", emoji: "🛎️" },
            { value: "Modifier le salon de logs message", description: "", emoji: "📩" },
            { value: "Supprimer le salon de logs message", description: "", emoji: "✉️" },
            { value: "Modifier le salon de logs vocal", description: "", emoji: "🎧" },
            { value: "Supprimer le salon de logs vocal", description: "", emoji: "🔊" },


        ]

      
            

            let interactiveButtons = new MessageMenu()
                .setID(message.id+'MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Faix un choix');
            menuoptions.forEach(option => {
                let row = new MessageMenuOption()
                    .setLabel(option.label ? option.label : option.value)
                    .setValue(option.value)
                    .setDescription(option.description)
                    .setDefault()
                if (option.emoji) row.setEmoji(option.emoji)
                interactiveButtons.addOption(row)
            })
            const bt2 = new MessageButton()
            .setStyle("gray")
            .setID("logs"+message.id)
            .setEmoji("❌")
            .setLabel("Re formuler votre choix")
           msg.edit({embed: embed,
                components: [
                  
                    {
                      type: 1,
                      components: [interactiveButtons]
                    },
                
                    {
                        type: 1,
                        components: [bt2],
                      }]})        }

                      if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true) {
                        const embed = new Discord.MessageEmbed()
                .setTitle(`Configuration Logs`)
                .setColor(color)
                .addField("Logs Mods", message.guild.channels.cache.get(db.get(`${message.guild.id}.logmod`)) ?   `<#${db.get(`${message.guild.id}.logmod`)}> (${db.get(`${message.guild.id}.logmod`)})`:":x:")
                .addField("Logs Message", message.guild.channels.cache.get(db.get(`${message.guild.id}.msglog`)) ?   `<#${db.get(`${message.guild.id}.msglog`)}> (${db.get(`${message.guild.id}.msglog`)})`:":x:")
                .addField("Logs Vocal",message.guild.channels.cache.get( db.get(`${message.guild.id}.logvc`)) ?   `<#${db.get(`${message.guild.id}.logvc`)}> (${db.get(`${message.guild.id}.logvc`)})`:":x:")



            let menuoptions = [
                { value: "Modifier le salon de logs mods", description: "", emoji: "🏷️" },
                { value: "Supprimer le salon de logs mods", description: "", emoji: "🛎️" },
                { value: "Modifier le salon de logs message", description: "", emoji: "📩" },
                { value: "Supprimer le salon de logs message", description: "", emoji: "✉️" },
                { value: "Modifier le salon de logs vocal", description: "", emoji: "🎧" },
                { value: "Supprimer le salon de logs vocal", description: "", emoji: "🔊" },


            ]

            let interactiveButtons = new MessageMenu()
                .setID(message.id+'MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder('Faix un choix');
            menuoptions.forEach(option => {
                let row = new MessageMenuOption()
                    .setLabel(option.label ? option.label : option.value)
                    .setValue(option.value)
                    .setDescription(option.description)
                    .setDefault()
                if (option.emoji) row.setEmoji(option.emoji)
                interactiveButtons.addOption(row)
            })
            const bt2 = new MessageButton()
            .setStyle("gray")
            .setID("logs"+message.id)
            .setEmoji("❌")
            .setLabel("Re formuler votre choix")
           message.channel.send({embed: embed,
                components: [
                  
                    {
                      type: 1,
                      components: [interactiveButtons]
                    },
                
                    {
                        type: 1,
                        components: [bt2],
                      }]})   .then(async m => {
                setTimeout(() => {
                    m.edit("", { components: [], embed:new Discord.MessageEmbed()
                        .setTitle(`Configuration Logs`)
                        .setColor(color)
                        .addField("Logs Mods", message.guild.channels.cache.get(db.get(`${message.guild.id}.logmod`)) ?   `<#${db.get(`${message.guild.id}.logmod`)}> (${db.get(`${message.guild.id}.logmod`)})`:":x:")
                        .addField("Logs Message", message.guild.channels.cache.get(db.get(`${message.guild.id}.msglog`)) ?   `<#${db.get(`${message.guild.id}.msglog`)}> (${db.get(`${message.guild.id}.msglog`)})`:":x:")
                        .addField("Logs Vocal",message.guild.channels.cache.get( db.get(`${message.guild.id}.logvc`)) ?   `<#${db.get(`${message.guild.id}.logvc`)}> (${db.get(`${message.guild.id}.logvc`)})`:":x:")
         })
                    // message.channel.send(embeds)
                }, 60000 * 5)
                client.on('clickMenu', async (menu) => {
                    if (message.author !== menu.clicker.user || menu.message.id !== m.id ) return ;
                    menu.reply.defer(true)
                    menuselection(menu)
                })
                client.on('clickButton', async (button) => {
                    if (message.author !== button.clicker.user) return ;
                
                    if(button.id === "logs"+message.id) {
                        button.reply.defer(true)
updateembed(m)
                    }
                })
                function menuselection(menu) {
                    switch (menu.values[0]) {
                        case "Modifier le salon de logs mods":
                            message.channel.send(`Quel est **le nouveau salon de logs mods** ?`).then(mp => {
                                mp.channel.awaitMessages(response => { return response.author.id === message.author.id }, { max: 1, time: 60000, errors: ['time'] })
                                    .then(cld => {

                                        var msg = cld.first();
                                        var role = message.guild.channels.cache.get(msg.content) || msg.mentions.channels.first()
                                        if (!role) return message.channel.send(`Aucun salon trouvé pour \`${msg.content}\`.`);

                                        db.set(`${message.guild.id}.logmod`, role.id)
                                        mp.delete()
                                        cld.first().delete()
                                        updateembed(m)

                                    });
                            })
                            break
                        case "Supprimer le salon de logs mods":
                            db.delete(`${message.guild.id}.logmod`)
                            updateembed(m)
                            break

                           case "Modifier le salon de logs message":
                            message.channel.send(`Quel est **le nouveau salon de logs message** ?`).then(mp => {
                                mp.channel.awaitMessages(response => { return response.author.id === message.author.id }, { max: 1, time: 60000, errors: ['time'] })
                                    .then(cld => {

                                        var msg = cld.first();
                                        var role = message.guild.channels.cache.get(msg.content) || msg.mentions.channels.first()
                                        if (!role) return message.channel.send(`Aucun salon trouvé pour \`${msg.content}\`.`);

                                        db.set(`${message.guild.id}.msglog`, role.id)
                                        mp.delete()
                                        cld.first().delete()
                                        updateembed(m)

                                    });
                            })
                            break
                        case "Supprimer le salon de logs message":
                            db.delete(`${message.guild.id}.msglog`)
                            updateembed(m)
                            break        

                            case "Modifier le salon de logs vocal":
                                message.channel.send(`Quel est **le nouveau salon de logs vocal** ?`).then(mp => {
                                    mp.channel.awaitMessages(response => { return response.author.id === message.author.id }, { max: 1, time: 60000, errors: ['time'] })
                                        .then(cld => {
    
                                            var msg = cld.first();
                                            var role = message.guild.channels.cache.get(msg.content) || msg.mentions.channels.first()
                                            if (!role) return message.channel.send(`Aucun salon trouvé pour \`${msg.content}\`.`);
    
                                            db.set(`${message.guild.id}.logvc`, role.id)
                                            mp.delete()
                                            cld.first().delete()
                                            updateembed(m)
    
                                        });
                                })
                                break
                            case "Supprimer le salon de logs vocal":
                                db.delete(`${message.guild.id}.logvc`)
                                updateembed(m)
                                break    
                    }
                }
            })

        }

    }
}