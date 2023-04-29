const Discord = require('discord.js')

module.exports = {
    name: 'snipe',
    run: async (client, message, args) => {
        if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true || db.get(`public_${message.guild.id}`) === true ) {
            const guild = message.guild;
            if(!guild.me.hasPermission("ADMINISTRATOR")){
    return;
            }
    let prefix =  db.get(` ${process.env.owner}.prefix`)
    if(prefix === null) prefix = process.env.prefix;
      let color = db.get(`${process.env.owner}.color`) 
       if(color === null  ) color = process.env.color

    const msg = client.snipes.get(message.channel.id)
    if (msg == null){
        const embed = new Discord.MessageEmbed()
        .setTitle("Snipe")
.setDescription("Aucun message a snipe")
message.channel.send(embed);
    }
    else{
        if (msg.content.includes('discord.gg/')) msg.content.replace("discord.gg/", "/.")
        if (msg.content.includes('discord.com/invite/')) msg.content.replace("discord.com/invite/", "/.")
        

    const embed = new Discord.MessageEmbed()
    .setDescription(msg.content)
    .setColor(color)
    .setAuthor("Message par" + msg.author, msg.avatar)
    .setFooter("Snipe")
    .setTimestamp()
    message.channel.send(embed);
}
    }
}
}