const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms)})}
  const ms = require('ms')

module.exports = {
name: 'channel',
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

if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true || db.get(`public_${message.guild.id}`) === true ) {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel

    let channelId = channel.id;
    let channelName = channel.name;
    let channelTopic = channel.topic === null || channel.topic === undefined ? "Aucun topic" : channel.topic;
    let channelNormalPos = channel.position;
    let channelRawPos = channel.rawPosition;
    let channelParent = channel.parent === null || channel.parent === undefined ? "Aucune catégorie" : channel.parent.name;
    let channelMembers = channel.members.size === channel.guild.members.cache.size ? false : channel.members.size;
    let guildMemberCount = message.guild.members.cache.size;
    //let channelMemberPercent = !channelMembers ? "Tout le monde" : `Pourcentage du serveur: ${parseInt(channelMembers/guildMemberCount*100).toFixed(0)}%\n${channelMembers <= 1 ? "Membre" : "Membres"}: ${channelMembers}`;
   let channelMemberPercent = !channelMembers ? "Tout le monde" : `${channelMembers}`;

   let slow = channel.rateLimitPerUser ? channel.rateLimitPerUser: "Non";

    let channelNsfw = channel.nsfw ? "Oui" : "Non";
    let channelLastMessage = channel.lastMessage ? channel.lastMessage.length > 1024 ? `Message trop long (${channel.lastMessage.length}/1024)` : channel.lastMessage : "Aucun message trouvé dans le cache.";
   // moment.locale("fr");
  //  let createdAt = moment.utc(channel.createdAt).format("LL");
    let channelIcon = channel.type.replace(/text/g, "https://i.imgur.com/mxeI2Or.png").replace(/voice/g, "https://i.imgur.com/UUyQ1BC.png")
       .replace(/category/g, "https://i.imgur.com/PVexhTx.png").replace(/news/g, "https://i.imgur.com/YHRVzqL.png");
    let channelType = channel.type.replace(/text/g, "Salon textuel").replace(/voice/g, "Salon vocal")
       .replace(/category/g, "Catégorie").replace(/news/g, "Salon d'annonces");
 
    let channelEmbed = new Discord.MessageEmbed()
       .setColor(color)
    //    .setThumbnail(channelIcon)
       .addField("Nom ", `<#${channelId}>`)
       .addField("ID", `${channelId}`, true)
       .addField("Membres ayant accès au salon", `${channelMemberPercent}`, true)
     //  .addField("Création", `${createdAt}`, true)
       .addField("NSFW", `${channelNsfw}`, true)
       .addField("Slowmode", `${slow}`, true)

//        .addField("Type", `${channelType}`, true)
//        .addField("Positions", `Normale: ${channelNormalPos}
//  Brute: ${channelRawPos}`, true)
    //    .addField("Catégorie", `${channelParent}`, true)
    //    .addField("Topic", `${channelTopic}`, false)
    //    .addField("Dernier message", `${channelLastMessage}`)
    .setFooter(`Création du salon`)
       .setTimestamp(channel.createdAt);
 
    message.channel.send(channelEmbed);
} else {

}

}
}