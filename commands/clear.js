const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: 'clear',
    aliases: [],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
//  if(args[0] === "prevname") {
//   if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true || db.get(`public_${message.guild.id}`) === true) {
//     let member =  message.author

//     db.delete(`usernames_${member.id}`)
//     db.delete(`nombreuser_${member.id}`, db.get(`nombreuser_${member.id}`) )
//     message.channel.send(`Tout vos anciens pseudos ont été supprimé`)
//   }
//  } else  
  if(args[0] === "wl") {
      if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
        message.channel.send(`${db.get(`${message.guild.id}.wlcount`) === undefined||null ? 0:db.get(`${message.guild.id}.wlcount`)} ${db.get(`${message.guild.id}.wlcount`) > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} de la whitelist`)
            db.delete(`${message.guild.id}.wlcount`)
            db.delete(`${message.guild.id}.wl`)
            let tt = await db.all().filter(data => data.ID.startsWith(`${message.guild.id}`));
            let ttt = 0;
            for(let i = 0; i < tt.length; i++) {
              db.delete(tt[i].ID);
              ttt++;
            }   
        } else {
            
        }
    }
    else  if(args[0] === "bl") {
      if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
        message.channel.send(`${db.get(`${process.env.owner}.blacklistcount`) === undefined||null ? 0:db.get(`${process.env.owner}.blacklistcount`)} ${db.get(`${process.env.owner}.blacklistcount`) > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} de la blacklist`)
            db.delete(`${process.env.owner}.blacklistcount`)
            db.delete(`${process.env.owner}.blacklist`)
            let tt = await db.all().filter(data => data.ID.startsWith(`blacklistmd`));
            let ttt = 0;
            for(let i = 0; i < tt.length; i++) {
              db.delete(tt[i].ID);
              ttt++;
            }   
        } else {
            
        }

    }
else    if(args[0] === "owners") {
      if(process.env.owner ===message.author.id) {
        message.channel.send(`${db.get(`${process.env.owner}.ownercount`) === undefined||null ? 0:db.get(`${process.env.owner}.ownercount`)} ${db.get(`${process.env.owner}.ownercount`) > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} des owners`)
            db.delete(`${process.env.owner}.ownercount`)
            db.delete(`${process.env.owner}.owner`)
            let tt = await db.all().filter(data => data.ID.startsWith(`ownermd`));
            let ttt = 0;
            for(let i = 0; i < tt.length; i++) {
              db.delete(tt[i].ID);
              ttt++;
            }   
            
              
 
        } else {

        }

    } 
   

    }
}