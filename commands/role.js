const Discord= require('discord.js')
const db = require('quick.db')
 // VIEW_AUDIT_LOG:`Voir les logs du serveur`,

        // CREATE_INSTANT_INVITE: `Créer une invitations`,
    // CHANGE_NICKNAME: `Changer le pseudo`,
    // MANAGE_NICKNAMES: `Gérer les pseudos`,
    // MANAGE_EMOJIS: `Gérer les émojis`,
    // VIEW_CHANNEL: `Lire les salons textuels & voir les salons vocaux`,
    // SEND_MESSAGES: `Envoyer des messages`,
    // SEND_TTS_MESSAGES: `Envoyer des messages TTS`,
    // MANAGE_MESSAGES: `Gérer les messages`,
    // EMBED_LINKS: `Intégrer des liens`,
    // ATTACH_FILES: `Joindre des fichiers`,
    // READ_MESSAGE_HISTORY: `Voir les anciens messages`,
      // USE_EXTERNAL_EMOJIS: `Utiliser des émojis externe`,
    // ADD_REACTIONS: `Ajouter des réactions`,
    // CONNECT: `Se connecter`,
    // SPEAK: `Parler`,
    // MUTE_MEMBERS: `Couper les micros de membres`,
    // DEAFEN_MEMBERS: `Mettre en sourdine des membres`,
    // MOVE_MEMBERS: `Déplacer des membres`,
    // USE_VAD: `Utiliser la détection de la voix`
module.exports = {
name: 'role',
aliases: [],
run: async (client, message, args) => {
var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
 return;
            }
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
   var guild = message.guild

if(process.env.owner ===message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
if(!role) return

    
const perms = {
    ADMINISTRATOR: "Administrateur",
    MANAGE_GUILD: `Gérer le serveur`,
    MANAGE_ROLES: `Gérer les rôles`,
    MANAGE_CHANNELS: `Gérer les salons`,
    KICK_MEMBERS: `Expulser des membres`,
    BAN_MEMBERS: `Bannir des membres`,

    MANAGE_WEBHOOKS: `Gérer les webhooks\n`,
        VIEW_AUDIT_LOG:``,

        CREATE_INSTANT_INVITE: ``,
    CHANGE_NICKNAME: ``,
    MANAGE_NICKNAMES:``,
    MANAGE_EMOJIS: ``,
    VIEW_CHANNEL: ``,
    SEND_MESSAGES: ``,
    SEND_TTS_MESSAGES: ``,
    MANAGE_MESSAGES: ``,
    EMBED_LINKS:``,
    ATTACH_FILES: ``,
    READ_MESSAGE_HISTORY: ``,
      USE_EXTERNAL_EMOJIS: ``,
    ADD_REACTIONS: ``,
    CONNECT: ``,
    SPEAK: ``,
    MUTE_MEMBERS: ``,
    DEAFEN_MEMBERS: ``,
    MOVE_MEMBERS: ``,
    USE_VAD:``,
    MENTION_EVERYONE: `Mentionner @everyone, @here et tous les rôles`,
  
  }
  const allPermissions = Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) =>{ if(perm.includes("ADMINISTRATOR")){return `Administrateur`} else {perms[perm]}}).join("")

    let roleEmbed = new Discord.MessageEmbed()
    roleEmbed.setColor(color)
    //    .setThumbnail(roleIcon)
    roleEmbed.addField("Nom ", `<@&${role.id}>`)
    roleEmbed.addField("Membres possédant le rôle", `${role.members.size}`, true)
    roleEmbed.addField("Couleur", `${role.hexColor ==="#000000" ? "Classique":role.hexColor}`, true)
    roleEmbed .addField("ID", `${role.id}`, true)
     //  .addField("Création", `${createdAt}`, true)
     roleEmbed .addField("Affiché séparément", `${role.hoist ? "Oui":"Non"}`, true)
     roleEmbed  .addField("Mentionable", `${role.mentionable? "Oui":"Non"}`, true)
     roleEmbed .addField("Géré par une intégration", `${role.managed? "Oui":"Non"}`, true)
 roleEmbed.addField("Permissions principales", `${allPermissions || "Aucune"}`)
    .setFooter(`Création du rôle`)
       .setTimestamp(role.createdAt);
 
    message.channel.send(roleEmbed);
} else {

}

}
}
