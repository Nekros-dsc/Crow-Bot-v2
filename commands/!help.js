const Discord= require('discord.js')
const db = require('quick.db')
const {MessageButton, MessageActionRow} = require("discord-buttons")
async function createPages (interaction, message, embeds, duration, buttonStyle, rightEmoji, leftEmoji, cancelEmoji) {
    if (!['red', 'green', 'blurple'].includes(buttonStyle)) throw new TypeError(`Button style provided is not valid. Valid options: red, green, blurple`);
    if (!rightEmoji) throw new TypeError(`An emoji to go to the next page was not provided.`);
    if (!leftEmoji) throw new TypeError(`An emoji to go to the previous page was not provided.`);
    if (!leftEmoji) throw new TypeError(`An emoji to go cancel the embed page was not provided.`);

    const fowardButton = new MessageButton()
        .setLabel(rightEmoji)
        .setStyle(buttonStyle)
       // .setEmoji(rightEmoji)
        .setID('next-page');

    const backButton = new MessageButton()
        .setLabel(leftEmoji)
        .setStyle(buttonStyle)
        //.setEmoji(leftEmoji)
        .setID('back-page');



    const interactiveButtons = new MessageActionRow()
        .addComponent(backButton)
        .addComponent(fowardButton);

    const msg = await message.channel.send({ components: [interactiveButtons], embed: embeds[0] });
    interaction.message = msg;
    interaction.embeds = embeds;
    interaction.currentPage = 0;
    interaction.duration = 60 * 1000;
    interaction.interactor = message.author;
    interaction.buttonStartTime = Date.now();
    interaction.components = interactiveButtons;
}

async function buttonInteractions (button, interaction)  {
    if (interaction.interactor !== button.clicker.user || Date.now - interaction.buttonStartTime >= interaction.duration || button.message.id !== interaction.message.id) return;
    if (button.id == 'next-page') {
        (interaction.currentPage + 1 == interaction.embeds.length ? interaction.currentPage = 0 : interaction.currentPage += 1);
        interaction.message.edit({ embed: interaction.embeds[interaction.currentPage], components: [interaction.components] });
        button.reply.defer(true);
    } else if (button.id == 'back-page') {
        (interaction.currentPage - 1 < 0 ? interaction.currentPage = interaction.embeds.length - 1 : interaction.currentPage -= 1);
        interaction.message.edit({ embed: interaction.embeds[interaction.currentPage], components: [interaction.components] });
        button.reply.defer(true);
    } 
}
module.exports = {
    name: 'help',
    aliases: [],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
 
if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true) {
       

    const help = new Discord.MessageEmbed()
    .setTitle(`Panel d'aide de Nova World`)
    .setDescription(`Mon prefix sur ce serveur est: \`${prefix}\`\nNombre de commandes : \`${client.commands.size}\`\nPour plus d'information sur les commandes, veillez changer de pages en réagissant au flèches tout en bas de cette embed !`)
    .setColor(color)
    .addField(`・Générale`, ` \`help\``)
    .addField(`・Modération`, ` \`sanctions\`, \`warn\`, \`addrole\`, \`del sanctions\`, \`clear sanctions\`, \`clear\`, \`mute\`, \`mutelist\`, \`kick\`, \`ban\`, \`unban\`, \`ban list\`, \`lock\`, \`unlock\`, \`derank\`, \`renew\`,\`muterole\`, \`set muterole\`, \`hide\`, \`unhide\`, \`snipe\`, \`maintenance\`, \`cleanup\`, \`voicemove\`, \`voicemute\`, \`voicecasque\`, \`voiceuncasque\`, \`voiceunmute\``)
    .addField(`・Logs`, ` \`logs\`, \`settings\`, \`modlog\`, \`messagelog\`, \`voicelog\`, \`raidlog\``)
    .addField(`・Server gestion`, ` \`slowmode\`, \`status\`, \`embed\`, \`massiverole\`, \`unmassiverole\`, \`autorole\`, \`tempvoc\`, \`joinvoc\``)
    .addField(`・Sécurity`, ` \`secur\`, \`antitoken\`, \`antichannel\`, \`antirole\`, \`antiwebhook\`, \`clear webhooks\`, \`antiban\`, \`antiunban\`, \`antibot\`, \`antieveryone\`, \`antispam\`, \`antilink\`, \`antiupdate\`, \`antiphoto\`, \`punition\`, \`creation limit\`, \`public\`, \`wl\`, \`wl list\`, \`unwl\`, \` clear wl\``)
    .addField(`・Utilitaire`, ` \`ping\`, \`alladmins\`, \`allbots\`, \`botadmins\`, \`rolemembers\`, \`role\`, \`channel\`, \`pic\`, \`server pic\`, \`server banner\`, \`snipe\``)
    .addField(`・Bot control`, ` \`set\`, \`stream\`, \`play\`, \`watch\`, \`listen\`, \`remove activity\`, \`online\`, \`idle\`, \`dnd\`, \`invisible\`, \`server list\`, \`invite\`, \`secur invite\`, \`say\`, \`bl\`, \`bl list\`, \`unbl\`, \`clear bl\``)
    .addField(`・Owner`, ` \`owner\`, \`owner list\`, \`unowner\`, \`clear owners\``)
    .setFooter(client.user.username,client.user.displayAvatarURL({dynamic : true }))


    const mod = new Discord.MessageEmbed()
    .setTitle('・Modération')
    .setColor(color)
    .addField(`\`${prefix}sanctions <membre>\``, "Voie toute les sanctions d'un membre")
    .addField(`\`${prefix}warn <membre>\``, "Warn un membre")
    .addField(`\`${prefix}addrole <membre> <role>\``, "Ajoute un rôle au membre mentionner")
    .addField(`\`${prefix}del sanctions <id> <membre>\``, "Supprime une sanctions d'un membre")
    .addField(`\`${prefix}clear sanctions <membre>\``, "Supprime toute les sanctions d'un membre")
    .addField(`\`${prefix}clear [nombre]\``, "Supprime le nombre de messages donnés dans le salon actuel")
    .addField(`\`${prefix}mute <membre> [raison] [durée]\``, "Mute un ou plusieurs membres, une raison et un temps peut être précisée")
    .addField(`\`${prefix}unmute <membre>\``, "Met fin au mute d'un ou plusieurs membres")
    .addField(`\`${prefix}mutelist\``, "Affiche la liste de tous les mutes en cours sur le serveur")
    .addField(`\`${prefix}kick <membre> [raison]\``, "Expulse un ou plusieurs membres du serveur, une raison peut être précisée")
    .addField(`\`${prefix}ban <membre> [raison] [durée]\``, "Bannit un ou plusieurs membres du serveur, une raison et un temps peut être précisée")
    .addField(`\`${prefix}unban <membre/all>\``, "Enlève le ban d'un ou plusieurs membres sur le serveur")
    .addField(`\`${prefix}lock/unlock [salon/all]\``, "Ferme ou ouvre complètement un ou plusieurs salon textuel")
    .addField(`\`${prefix}derank <membre>\``, "Supprime tous les rôles d'un ou plusieurs membres")
    .addField(`\`${prefix}renew [salon/all]\``, "Supprime et recrée un salon textuel")
    .addField(`\`${prefix}muterole\``, "Crée un rôle muet ou met à jour celui qui existe déjà, et affiche les erreurs de réglage de permissions")
    .addField(`\`${prefix}set muterole <rôle>\``, "Définit le rôle muet sur un rôle déjà existant")
    .addField(`\`${prefix}hide\``, "Rend le salon invisible")
    .addField(`\`${prefix}unhide\``, "Rend le salon visible")
    .addField(`\`${prefix}snipe\``, "Permet de voir le dernier message supprimer et qui l'a supprimer")
    .addField(`\`${prefix}maintenance on/off\``, "Rend tous les salons et vocaux invisibles et créé des salons tempo")
    .addField(`\`${prefix}cleanup\``, "Le bot va kick toutes les personnes qui sont dans votre salon vocal")
    .addField(`\`${prefix}voicemove <salon à déplacer> <futur salon>\``, "Déplace tous les membres en vocal dans un salon")
    .addField(`\`${prefix}voicemute\``, "Permet de mute toutes les personnes en vocal")
    .addField(`\`${prefix}voicecasque\``, "Permet de mute casque toutes les personnes en vocal")
    .addField(`\`${prefix}voiceuncasque\``, "Permet d'enlever le mute casque de toutes les personnes en voc")
    .addField(`\`${prefix}voiceunmute\``, "Permet d'unmute toutes les personnes qui sont mute par un staff en vocal")
    .setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
    .setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)

    


    const log = new Discord.MessageEmbed()
    .setTitle('・Logs')
    .setColor(color)
    .setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
    .addField(`\`${prefix}logs\``, "Permet de gérer les logs du serveur")
    .addField(`\`${prefix}settings\``, "Affiche les paramètres actuels du bot sur le serveur")
    .addField(`\`${prefix}modlog <on/salon>\``, "Active les logs de modération dans un salon")
    .addField(`\`${prefix}modlog off\``, "Désactive les logs de modération")
    .addField(`\`${prefix}messagelog <on/salon>\``, "Active les logs des messages supprimés et édités dans un salon")
    .addField(`\`${prefix}messagelog off\``, "Désactive les logs de messages supprimés et édités")
    .addField(`\`${prefix}voicelog off\``, "Désactive les logs vocaux")
    .addField(`\`${prefix}voicelog <on/salon>\``, "Active les logs vocaux dans un salon")
    .addField(`\`${prefix}raidlog <on/salon>\``, "Active les logs de l'antiraid dans un salon")
    .addField(`\`${prefix}raidlog off\``, "Desactive les logs de l'antiraid dans un salon")
    .setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
    

const gestion = new Discord.MessageEmbed()
.setTitle('・Server gestion')
.setColor(color)
.setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
.setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
.addField(`\`${prefix}slowmode <durée> [salon]\``, "Change la durée du mode lent sur un salon (max 6h)")
.addField(`\`${prefix}status <on/off>\``, "Active/désactive le status")
.addField(`\`${prefix}status <role id> <status>\``, "Défini le status")
.addField(`\`${prefix}embed\``, "Permet de créer un embed")
.addField(`\`${prefix}massiverole <role>\``, "Ajoute un rôle à tous les membres d'un serveur")
.addField(`\`${prefix}unmassiverole <role>\``, "Supprime un rôle à tous les membres d'un serveur")
.addField(`\`${prefix}autorole <@role>\``, "Permet de donner un rôle aux nouveaux")
.addField(`\`${prefix}tempvoc <salon/remove>\``, "Défini un salon vocal temporaire")
.addField(`\`${prefix}joinvoc <salon/remove>\``, "Rejoint un salon et reste sur le salon")

const security = new Discord.MessageEmbed()
.setTitle('・Sécurity')
.setColor(color)
.setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
.setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
.addField(`\`${prefix}secur\``, "Affiche les paramètres de l'antiraid sur le serveur")
.addField(`\`${prefix}secur <off/on/max>\``, "Permet de changer rapidement les paramètre de l'antiraid sur le serveur")
.addField(`\`${prefix}antitoken <on/off>\``, "Active/désactive l'antitoken")
.addField(`\`${prefix}antitoken <nombre de personnes>/<temps>\``, "Règle la sensibilité de l'antitoken : le nombre de personnes devant rejoindre en un certain temps pour que l'antitoken s'active")
.addField(`\`${prefix}antichannel <on/off>\``, "Active/désactive l'antichannel")
.addField(`\`${prefix}antirole <off/on>\``, "Active/désactive l'antirole")
.addField(`\`${prefix}antiwebhook <off/on>\``, "Active/désactive l'antiwebhook")
.addField(`\`${prefix}clear webhooks\``, "Supprime tous les webhooks du serveur")
.addField(`\`${prefix}antiban <off/on>\``, "Active/désactive l'antiban")
.addField(`\`${prefix}antiunban <off/on>\``, "Active/désactive l'antiunban")
.addField(`\`${prefix}antibot <off/on>\``, "Active/désactive l'antibot")
.addField(`\`${prefix}antieveryone <off/on>\``, "Active/désactive l'antieveryone")
.addField(`\`${prefix}antispam <on/off>\``, "Allume/éteint l'antispam")
.addField(`\`${prefix}antispam <nombre de messages>/<durée>\``, "Définit la sensibilité de l'antispam")
.addField(`\`${prefix}antilink <on/off>\``, "Allume/éteint l'antilink")
.addField(`\`${prefix}antilink invite/all\``, "Définit si l'antilink s'active pour tous les liens ou seulement pour les invitations discord")
.addField(`\`${prefix}antiupdate <off/on>\``, "Active/désactive l'antiupdate")
.addField(`\`${prefix}antiphoto <off/on>\``, "Active/désactive l'antiphoto")
.addField(`\`${prefix}punition <derank/kick/ban>\``, "Règle la punition des membres tentant de raid")
.addField(`\`${prefix}creation limit <durée>\``, "Définit depuis combien de temps le compte d'un utilisateur doit être créé pour pouvoir rejoindre le serveur")
.addField(`\`${prefix}public <on/off>\``, "Active ou désactive les commandes public")
.addField(`\`${prefix}wl <@membre/ID>\``, "Ajoute quelqu'un à la whitelist d'un serveur, il ne sera plus affecté par l'antiraid")
.addField(`\`${prefix}wl list\``, "Affiche la whitelist d'un serveur")
.addField(`\`${prefix}unwl <@membre/ID>\``, "Retire quelqu'un de la whitelist d'un serveur")
.addField(`\`${prefix}clear wl\``, "Supprime tous les membres de la whitelist d'un serveur")

const util = new Discord.MessageEmbed()
.setTitle('・Utilitaire')
.setColor(color)
.setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
.setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
.addField(`\`${prefix}ping\``, "Affiche la vitesse de réaction du bot")
.addField(`\`${prefix}alladmins\``, "Affiche la liste des membres (hors bots) ayant la permission administrateur")
.addField(`\`${prefix}allbots\``, "Affiche la liste des bots présents sur le serveur")
.addField(`\`${prefix}botadmins\``, "Affiche la liste des bots ayant la permission administrateur")
.addField(`\`${prefix}rolemembers <rôle>\``, "Affiche la liste des membres ayant un rôle précis")
.addField(`\`${prefix}role <rôle>\``, "Affiche les informations relatives à un rôle")
.addField(`\`${prefix}channel [salon]\``, "Affiche les informations relatives à un salon")
.addField(`\`${prefix}pic [membre]\``, "Permet de récupérer la photo de profil de quelqu'un")
.addField(`\`${prefix}server pic\``, "Permet de récupérer l'icône du serveur")
.addField(`\`${prefix}server banner\``, "Permet de récupérer la bannière du serveur")
.addField(`\`${prefix}snipe\``, "Affiche le dernier message supprimé du salon")

const bot = new Discord.MessageEmbed()
.setTitle('・Bot control')
.setColor(color)
.setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
.setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
.addField(`\`${prefix}set <name/pic> [nom/lien]\``, "Permet de changer le nom, la photo de profil du bot")
.addField(`\`${prefix}<stream/play/watch/listen> [text]\``, "Change l'activité du bot, [text] peut contenir plusieurs phrases séparées par `,,` qui alterneront dans le profil du bot")
.addField(`\`${prefix}remove activity\``, "Supprime l'activité du bot")
.addField(`\`${prefix}<online/idle/dnd/invisible>\``, "Rend le statut du bot")
.addField(`\`${prefix}server list\``, "Affiche la liste des serveurs où se trouve le bot")
.addField(`\`${prefix}invite <ID>\``, "Envoie une invitation pour un serveur où se trouve le bot")
.addField(`\`${prefix}secur invite <on/off>\``, "Le bot quitte automatiquement quand il rejoint un serveur sans owner")
.addField(`\`${prefix}say <message>\``, "Fait dire au bot le message voulu")
.addField(`\`${prefix}bl <@membre/ID>\``, "Ajoute quelqu'un à la blacklist, il sera banni de tous les serveurs où le bot se trouve")
.addField(`\`${prefix}bl list\``, "Affiche la blacklist du bot")
.addField(`\`${prefix}unbl <@membre/ID>\``, "Retire quelqu'un de la blacklist du bot")
.addField(`\`${prefix}clear bl\``, "Supprime tous les membres de la blacklist du bot")

const owner = new Discord.MessageEmbed()
.setTitle('・Owner')
.setColor(color)
.setDescription(`*Les paramètres peuvent être des noms, des mentions, ou des IDs\nSi ce ne sont pas des mentions ils doivent être séparés par \`,,\`*`)
.setFooter(`${client.user.tag} • Prefix actuel : ${prefix}`)
.addField(`\`${prefix}owner <@membre/ID>\``, "Donne le grade owner à quelqu'un sur le bot, il aura toute les permissions dessus")
.addField(`\`${prefix}ownerlist\``, "Affiche la liste des owners du bot")
.addField(`\`${prefix}unowner <@membre/ID>\``, "Retire le grade owner à quelqu'un")
.addField(`\`${prefix}clear owners\``, "Supprime tous les owners du bot")


const embedPages = [help,mod,log,gestion,security,util,bot,owner];
createPages(client.interaction, message, embedPages, 60 * 1000, "blurple", "▶", "◀");

} else {

}

    }
}