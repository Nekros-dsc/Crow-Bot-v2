const Discord = require('discord.js');
const client = new Discord.Client({ fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] })
const disbut = require('discord-buttons');
disbut(client);
require('dotenv').config()
const db = require('quick.db')
const fs = require('fs');
const ms = require('ms');
const request = require('request');
const logs = require('discord-logs');
logs(client, { debug: true })
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.snipes = new Map()
client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))


let color = db.get(`${process.env.owner}.color`)
if (color === null) color = process.env.color
const guildInvites = new Map();

// login
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const commands = require(`./commands/${file}`)
  client.commands.set(commands.name, commands)

  console.log(`> commande charger ${commands.name}`)
}
client.on('ready', () => {
  console.log(`- Conecter ${client.user.username}`)



})
// guild message
client.on('guildCreate', async (guild) => {
  console.log(`J'ai rejoint le serveur ${guild.name} [${guild.memberCount}]`)
  client.users.cache.get(process.env.owner).send(`Je viens de rejoindre ${guild.name} (${guild.memberCount} membres, propriétaire : <@${guild.owner.id}>)`)
  let own = db.get(`${process.env.owner}.owner`)
  if (!own) { return }
  own.map((user, i) => { client.users.cache.get(user).send(`Je viens de rejoindre ${guild.name} (${guild.memberCount} membres, propriétaire : <@${guild.owner.id}>)`) })
})
client.on('guildDelete', async (guild) => {
  console.log(`J'ai quitter le serveur ${guild.name} [${guild.memberCount}]`)
  client.users.cache.get(process.env.owner).send(`Je viens de quitté ${guild.name} (${guild.memberCount} membres, propriétaire : <@${guild.owner.id}>)`)

  let own = db.get(`${process.env.owner}.owner`)
  if (!own) { return }
  own.map((user, i) => { client.users.cache.get(user).send(`Je viens de quitté ${guild.name} (${guild.memberCount} membres, propriétaire : <@${guild.owner.id}>)`) })
})
let prefix = db.get(` ${process.env.owner}.prefix`)
if (prefix === null) prefix = process.env.prefix;
//handler


client.on('message', async message => {
  if (!message.guild) return;
  if (message.author.bot) return;



  if (process.env.owner === message.author.id || db.get(`ownermd.${message.author.id}`) === true) {

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
      return message.channel.send(`Mon prefix sur ce serveur est : \`${prefix}\``)
    }
  }
  if (!message.content.startsWith(prefix)) return;

  let messageArray = message.content.split(" ");
  const args1 = message.content.slice(prefix.length).split(/ +/);
  const commandName = args1.shift().toLowerCase();
  let args = messageArray.slice(1);
  let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));



  if (command) command.run(client, message, args);


})
client.interaction = {}
const ButtonPages = require('discord-button-pages');
client.on('clickButton', (button) => {
  ButtonPages.buttonInteractions(button, client.interaction);
});


try {

  // antiraid / automod
  client.on("messageUpdate", async (oldMessage, newMessage) => {

    let guild = oldMessage.guild
    const pub = [
      "discord.me",
      "discord.io",
      "discord.gg",
      "invite.me",
      "discordapp.com/invite",
      ".gg",
      "@everyone",
      "@here"
    ];

    if (db.get(`link_${guild.id}`) === true) {
      let perm = guild.owner.id == oldMessage.member.id || process.env.owner == oldMessage.member.id || db.get(`ownermd.${oldMessage.member.id}`) === true || db.get(`${guild.id}.${oldMessage.member.id}.wlmd`) === true
      if (pub.some(word => newMessage.content.includes(word))) {

        if (perm) {
          return
        } else if (!perm) {

          newMessage.delete()
          db.add(`ee_${newMessage.member.id}`, 1)

        }
      }
    }
    let chx = db.get(`${oldMessage.guild.id}.msglog`);

    if (chx === null) {
      return;
    }
    const logschannel = oldMessage.guild.channels.cache.get(chx)

    if (logschannel) logschannel.send(new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(`${oldMessage.author.username}`, `${oldMessage.author.displayAvatarURL({ dynamic: true })}`)
      .setDescription(`**Message édité dans** <#${oldMessage.channel.id}>`)
      .addField(`Avant`, `${oldMessage.content}`)
      .addField(`Aprés`, `${newMessage.content}`)
      .setTimestamp())
  })
  client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {

    let chx = db.get(`${oldChannel.guild.id}.logvc`);

    if (chx === null) {
      return;
    }
    const logschannel = oldChannel.guild.channels.cache.get(chx)

    if (logschannel) logschannel.send(new Discord.MessageEmbed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
      .setColor(color)
      .setDescription(`**${member}** a changer de salon vocal, il a quitter ${oldChannel.name} 
  et a rejoint ${newChannel.name}`)

    )
  });
  client.on("messageDelete", async (message) => {

    let chx = db.get(`${message.guild.id}.msglog`);

    if (chx === null) {
      return;
    }
    const logschannel = message.guild.channels.cache.get(chx)

    if (logschannel) logschannel.send(new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
      .setColor('Purple')
      .setDescription(`**Message supprimé dans** <#${message.channel.id}>\n ${message.content}`)
      .setTimestamp())

  })
  client.on('channelCreate', async channel => {
    if (!channel.guild) return
    let Muted = await db.fetch(`mRole_${channel.guild.id}`);
    let muteRole = await channel.guild.roles.cache.get(Muted) || channel.guild.roles.cache.find(role => role.name === `muet`) || channel.guild.roles.cache.find(role => role.name === `Muted`) || channel.guild.roles.cache.find(role => role.name === `Mute`)

    if (!muteRole) {

    } else {
      await channel.createOverwrite(muteRole, {
        SEND_channelS: false,
        CONNECT: false,
        ADD_REACTIONS: false
      })
    }

  })
  client.on("voiceStreamingStart", async (member, voiceChannel) => {

    let chx = db.get(`${voiceChannel.guild.id}.logvc`);

    if (chx === null) {
      return;
    }
    const logschannel = voiceChannel.guild.channels.cache.get(chx)

    if (logschannel) logschannel.send(new Discord.MessageEmbed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
      .setColor(color)
      .setDescription(`**${member}** partage son écran dans ${voiceChannel.name}`)

    )

  });

  client.on("voiceStreamingStop", async (member, voiceChannel) => {
    let chx = db.get(`${voiceChannel.guild.id}.logvc`);

    if (chx === null) {
      return;
    }
    const logschannel = voiceChannel.guild.channels.cache.get(chx)

    if (logschannel) logschannel.send(new Discord.MessageEmbed()
      .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
      .setColor(color)
      .setDescription(`**${member}** ne partage plus son écran dans ${voiceChannel.name}`)

      .setTimestamp())
  });
  const usersEveryoneMap = new Map();
  const usersMap = new Map();
  const LIMIT = 10;
  const TIME = 10000;
  const DIFF = 2000;
  client.on('message', async message => {

    let guild = message.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return
    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    let Muted = await db.fetch(`mRole_${message.guild.id}`);
    let muterole = await message.guild.roles.cache.get(Muted) || message.guild.roles.cache.find(role => role.name === `muet`) || message.guild.roles.cache.find(role => role.name === `Muted`) || message.guild.roles.cache.find(role => role.name === `Mute`)
    if (!muterole) {
      muterole = await message.guild.roles.create({
        data: {
          name: 'muet',
          permissions: 0
        }
      }, "muterole")
      message.guild.channels.cache.forEach(channel => channel.createOverwrite(muterole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
      }, "muterole"))
      db.set(`mRole_${message.guild.id}`, `${muterole.id}`)


    }
    if (db.get(`everyone_${guild.id}`) === true) {
      let perm = guild.owner.id == message.author.id || process.env.owner == message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${guild.id}.${message.author.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (message.mentions.everyone) {
          const pub = ["@everyone", "@here"]
          if (pub.some(word => message.content.includes(word))) {
            if (message.author.id === client.user.id) return;

            db.add(`ee_${message.author.id}`, 1)

            if (db.get(`ee_${message.author.id}`) <= 3) {
              message.delete()
              message.channel.send(`${message.author} vous n'avez pas l'autorisation de mentionner tout le monde ici`).then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => message.delete());
              message.member.roles.add(muterole.id).catch(err => [])
              setInterval(() => { message.member.roles.remove(muterole.id).catch(err => []) }, 15 * 60000)
              const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${message.author} a été **mute 15minutes** pour avoir \`reçu 3 strike en 5m\``)
              if (logChannel) logChannel.send(embed)
            } else
              if (db.get(`ee_${message.author.id}`) <= 5) {
                message.delete()
                message.channel.send(`${message.author} vous n'avez pas l'autorisation de mentionner tout le monde ici`).then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => message.delete());
                message.member.kick().catch(err => [])
                const embed = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${message.author} a été **kick** pour avoir \`reçu 3 strike en 10m\``)
                if (logChannel) logChannel.send(embed)
              } else if (db.get(`ee_${message.author.id}`) <= 9) {
                message.delete()
                message.channel.send(`${message.author} vous n'avez pas l'autorisation de mentionner tout le monde ici`).then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => message.delete());
                message.member.ban().catch(err => [])
                const embed = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${message.author} a été **ban 1j** pour avoir \`reçu 5 strike en 1h\``)
                if (logChannel) logChannel.send(embed)

              }


            setInterval(async () => {
              db.delete(`ee_${message.author.id}`)

            }, 60 * 60000);
          }




        }
      }
    }
    else if (db.get(`link_${guild.id}`) === true) {
      let perm = guild.owner.id == message.author.id || process.env.owner == message.author.id || db.get(`ownermd.${message.author.id}`) === true || db.get(`${guild.id}.${message.author.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        let pub;
        if (db.get(`typelink_${guild.id}`) === null || " invite") {
          pub = [
            "discord.me",
            "discord.io",
            "discord.gg",
            "invite.me",
            "discordapp.com/invite",
            ".gg"
          ];


        }
        if (db.get(`typelink_${guild.id}`) === " all") {
          pub = [
            "discord.me",
            "discord.com",
            "discord.io",
            "discord.gg",
            "invite.me",
            "discord.gg/",
            "discord.",
            "discordapp.com/invite",
            ".gg",
            "https",
            "http",
            "https:"

          ];
        }

        if (pub.some(word => message.content.includes(word))) {

          message.delete()
          message.channel.send(`${message.author} vous n'avez pas l'autorisation d'envoyer des liens ici`).then(msg => { msg.delete({ timeout: 3000 }) }).catch(err => message.delete());
          db.add(`ee_${message.author.id}`, 1)
          const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${message.author} a été **strike** pour avoir \`envoyé un lien\` dans ${message.channel}`)
          if (logChannel) logChannel.send(embed)
          if (db.get(`ee_${message.author.id}`) <= 3) {
            message.member.roles.add(muterole.id).catch(err => [])
            setInterval(() => { message.member.roles.remove(muterole.id).catch(err => []) }, 15 * 60000)
            const embed = new Discord.MessageEmbed()
              .setColor(color)
              .setDescription(`${message.author} a été **mute 15minutes** pour avoir \`reçu 3 strike en 5m\``)
            if (logChannel) logChannel.send(embed)
          } else
            if (db.get(`ee_${message.author.id}`) <= 5) {

              message.member.kick().catch(err => [])
              const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${message.author} a été **kick** pour avoir \`reçu 3 strike en 10m\``)
              if (logChannel) logChannel.send(embed)
            } else if (db.get(`ee_${message.author.id}`) <= 9) {
              message.member.ban().catch(err => [])
              const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${message.author} a été **ban 1j** pour avoir \`reçu 5 strike en 1h\``)
              if (logChannel) logChannel.send(embed)

            }


          setInterval(async () => {
            db.delete(`ee_${message.author.id}`)

          }, 60 * 60000);
        }

      }
    }
  })
  const lang =
  {
    logsyes: "à été",
    logsr: "pour avoir",
    logserror: "J'ai pas pu",
    logsrolec: "créer un rôle",
    logsrolem: "modifié le rôle",
    kicker: "expulsé",
    baner: "banni",
    logsroled: "supprimer le rôle",
    logschannelc: "créer un canal",
    adrole: "`ajouté un rôle` à",
    removerole: "`supprimé un rôle` à",
    addperm: "`autorisations ajoutées` à",
    removeperm: "`autorisations supprimées` à",
    logswebhook: "créer un webhook",
    logschanneld: "supprimer le salon",
    logschannelm: "modifié le salon",
    logsguildm: "modifié le serveur",
    antitokenlogs: "a été **kick** pour avoir `rejoint en même temps qu'un autre utilisateur`",
    crealogs: "a été **kick** pour avoir `rejoint un compte créé trop récemment`",
    antibot2: "Le bot",
  }



  client.on("guildUpdate", async (oldGuild, newGuild) => {
    if (oldGuild === newGuild) return;
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = oldGuild

    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`update_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "GUILD_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;

      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        if (oldGuild.name === newGuild.name) {

        } else {
          await newGuild.setName(oldGuild.name)

        }
        if (oldGuild.iconURL({ dynamic: true }) === newGuild.iconURL({ dynamic: true })) {

        } else {
          await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))

        }
        if (oldGuild.bannerURL() === newGuild.bannerURL()
        ) {

        } else {
          await newGuild.setBanner(oldGuild.bannerURL())

        }
        if (oldGuild.position === newGuild.position
        ) {

        } else {
          await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])

        }

        if (oldGuild.systemChannel === newGuild.systemChannel
        ) {

        } else {
          await newGuild.setSystemChannel(oldGuild.systemChannel)

        }
        if (oldGuild.systemChannelFlags === newGuild.systemChannelFlags
        ) {

        } else {
          await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)


        }
        if (oldGuild.verificationLevel === newGuild.verificationLevel
        ) {

        } else {
          await newGuild.setVerificationLevel(oldGuild.verificationLevel)


        }
        if (oldGuild.widget === newGuild.widget
        ) {

        } else {
          await newGuild.setWidget(oldGuild.widget)


        }
        if (oldGuild.splashURL === newGuild.splashURL
        ) {

        } else {
          await newGuild.setSplash(oldGuild.splashURL)


        }
        if (oldGuild.rulesChannel === newGuild.rulesChannel
        ) {

        } else {
          await newGuild.setRulesChannel(oldGuild.rulesChannel)


        }
        if (oldGuild.publicUpdatesChannel === newGuild.publicUpdatesChannel
        ) {

        } else {
          await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)


        }
        if (oldGuild.defaultMessageNotifications === newGuild.defaultMessageNotifications
        ) {

        } else {
          await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)


        }
        if (oldGuild.afkChannel === newGuild.afkChannel
        ) {

        } else {
          await newGuild.setAFKChannel(oldGuild.afkChannel)


        }
        if (oldGuild.region === newGuild.region
        ) {

        } else {
          await newGuild.setRegion(oldGuild.region)


        }

        if (oldGuild.afkTimeout === newGuild.afkTimeout
        ) {

        } else {
          await newGuild.setAFKTimeout(oldGuild.afkTimeout)

        }
        if (oldGuild.vanityURLCode === newGuild.vanityURLCode
        ) {
          const settings = {
            url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`,
            body: {
              code: oldGuild.vanityURLCode
            },
            json: true,
            method: 'PATCH',
            headers: {
              "Authorization": `Bot ${process.env.token}`
            }
          };
          await request(settings, (err, res, body) => {
            if (err) {
              return;
            }
          });
        }

      } else { }
    } else if (db.get(`update_${guild.id}`) === "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "GUILD_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiupdate`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsguildm} ${guild.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        if (oldGuild.name === newGuild.name) {

        } else {
          await newGuild.setName(oldGuild.name)

        }
        if (oldGuild.iconURL({ dynamic: true }) === newGuild.iconURL({ dynamic: true })) {

        } else {
          await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))

        }
        if (oldGuild.bannerURL() === newGuild.bannerURL()
        ) {

        } else {
          await newGuild.setBanner(oldGuild.bannerURL())

        }
        if (oldGuild.position === newGuild.position
        ) {

        } else {
          await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])

        }

        if (oldGuild.systemChannel === newGuild.systemChannel
        ) {

        } else {
          await newGuild.setSystemChannel(oldGuild.systemChannel)

        }
        if (oldGuild.systemChannelFlags === newGuild.systemChannelFlags
        ) {

        } else {
          await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)


        }
        if (oldGuild.verificationLevel === newGuild.verificationLevel
        ) {

        } else {
          await newGuild.setVerificationLevel(oldGuild.verificationLevel)


        }
        if (oldGuild.widget === newGuild.widget
        ) {

        } else {
          await newGuild.setWidget(oldGuild.widget)


        }
        if (oldGuild.splashURL === newGuild.splashURL
        ) {

        } else {
          await newGuild.setSplash(oldGuild.splashURL)


        }
        if (oldGuild.rulesChannel === newGuild.rulesChannel
        ) {

        } else {
          await newGuild.setRulesChannel(oldGuild.rulesChannel)


        }
        if (oldGuild.publicUpdatesChannel === newGuild.publicUpdatesChannel
        ) {

        } else {
          await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)


        }
        if (oldGuild.defaultMessageNotifications === newGuild.defaultMessageNotifications
        ) {

        } else {
          await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)


        }
        if (oldGuild.afkChannel === newGuild.afkChannel
        ) {

        } else {
          await newGuild.setAFKChannel(oldGuild.afkChannel)


        }
        if (oldGuild.region === newGuild.region
        ) {

        } else {
          await newGuild.setRegion(oldGuild.region)


        }

        if (oldGuild.afkTimeout === newGuild.afkTimeout
        ) {

        } else {
          await newGuild.setAFKTimeout(oldGuild.afkTimeout)

        }
        if (oldGuild.vanityURLCode === newGuild.vanityURLCode
        ) {
          const settings = {
            url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`,
            body: {
              code: oldGuild.vanityURLCode
            },
            json: true,
            method: 'PATCH',
            headers: {
              "Authorization": `Bot ${process.env.token}`
            }
          };
          await request(settings, (err, res, body) => {
            if (err) {
              return;
            }
          });
        }

      } else { }
    }

  })
  client.on("roleCreate", async (role) => {

    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = role.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`roles_${guild.id}`) === true) {
      var wassim = role.guild.members.cache.filter(member => member.user.bot)
      wassim.map(r => { if (r.username === role.name) { return } })
      const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        role.delete(`Antirole`)


      } else { }
    } else if (db.get(`roles_${guild.id}`) === "max") {
      var wassim = role.guild.members.cache.filter(member => member.user.bot)
      wassim.map(r => { if (r.username === role.name) { return } })
      const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsrolec}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        role.delete(`Antirole`)


      } else { }
    }
  })
  client.on("roleDelete", async (oldRole, newRole) => {
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = oldRole.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`roles_${guild.id}`) === true) {
      oldRole.guild.members.cache.filter(member => member.user.bot).map(r => { if (r.username === oldRole.name) return })

      const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          oldRole.guild.roles.create({
            data: {
              name: oldRole.name,
              color: oldRole.hexColor,
              permissions: oldRole.permissions,
              hoist: oldRole.hoist,
              mentionable: oldRole.mentionable,
              position: oldRole.rawPosition,
              highest: oldRole.highest,
              reason: `Antirole`
            }

          })
        } catch (err) {

        }

      } else { }
    } else if (db.get(`roles_${guild.id}`) === "max") {
      oldRole.guild.members.cache.filter(member => member.user.bot).map(r => { if (r.username === oldRole.name) return })

      const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsroled} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          oldRole.guild.roles.create({
            data: {
              name: oldRole.name,
              color: oldRole.hexColor,
              permissions: oldRole.permissions,
              hoist: oldRole.hoist,
              mentionable: oldRole.mentionable,
              position: oldRole.rawPosition,
              highest: oldRole.highest,
              reason: `Antirole`
            }

          })
        } catch (err) {

        }

      } else { }
    } else { }
  })
  client.on("roleUpdate", async (oldRole, newRole) => {
    if (oldRole === newRole) return
    var wassim = oldRole.guild.members.cache.filter(member => member.user.bot)
    wassim.map(r => { if (r.username === oldRole.name) return })
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = oldRole.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`roles_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          await oldRole.edit({
            data: {
              name: oldRole.name,
              color: oldRole.hexColor,
              permissions: oldRole.permissions,
              hoist: oldRole.hoist,
              mentionable: oldRole.mentionable,
              position: oldRole.rawPosition,
              highest: oldRole.highest,
              reason: `Protection: ${this.name}`
            }
          })
        } catch (err) {

        }

      } else if (db.get(`roles_${guild.id}`) === "max") {

        const action = await guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;
        let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
        if (perm) {
          return
        } else if (!perm) {
          if (db.get(`sanction_${guild.id}`) === "ban") {
            guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          } else if (db.get(`sanction_${guild.id}`) === "kick") {
            guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })


          } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

            guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logsrolem} ${oldRole.name}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          }
          try {
            await oldRole.edit({
              data: {
                name: oldRole.name,
                color: oldRole.hexColor,
                permissions: oldRole.permissions,
                hoist: oldRole.hoist,
                mentionable: oldRole.mentionable,
                position: oldRole.rawPosition,
                highest: oldRole.highest,
                reason: `Protection: ${this.name}`
              }
            })
          } catch (err) {

          }

        }
      }
    }
  })
  client.on("guildMemberRoleRemove", async (member, role) => {

    if (!member) return;
    if (!role) return;


    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = member.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))

    if (db.get(`roles_${guild.id}`) === true) {

      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let maxt = false
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {

        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
          member.roles.add(role, `Antirole`).then(() => {
            if (db.get(`sanction_${guild.id}`) === "ban") {
              guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            } else if (db.get(`sanction_${guild.id}`) === "kick") {
              guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })


            } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

              guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            }
          }).catch(err => { })


        } else {
          if (maxt === true) {
            member.roles.add(role, `Antirole`).then(() => {
              if (db.get(`sanction_${guild.id}`) === "ban") {
                guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              } else if (db.get(`sanction_${guild.id}`) === "kick") {
                guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })


              } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

                guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              }
            }).catch(err => { })
          } else {

          }
        }

      }
    } else if (db.get(`roles_${guild.id}`) === "max") {

      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let maxt = true
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {

        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
          member.roles.add(role, `Antirole`).then(() => {
            if (db.get(`sanction_${guild.id}`) === "ban") {
              guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            } else if (db.get(`sanction_${guild.id}`) === "kick") {
              guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })


            } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

              guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.removeperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            }
          }).catch(err => { })


        } else {
          if (maxt === true) {
            member.roles.add(role, `Antirole`).then(() => {
              if (db.get(`sanction_${guild.id}`) === "ban") {
                guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              } else if (db.get(`sanction_${guild.id}`) === "kick") {
                guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })


              } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

                guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.removerole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              }
            }).catch(err => { })
          } else {

          }
        }
      }

    }


  })
  client.on("guildMemberRoleAdd", async (member, role) => {

    if (!member) return;
    if (!role) return;


    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = member.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`roles_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      let maxt = false

      if (perm) {
        return
      } else if (!perm) {

        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
          member.roles.remove(role, `Antirole`).then(() => {
            if (db.get(`sanction_${guild.id}`) === "ban") {
              guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            } else if (db.get(`sanction_${guild.id}`) === "kick") {
              guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })


            } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

              guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            }
          }).catch(err => { })


        } else {
          if (maxt === true) {
            member.roles.remove(role, `Antirole`).then(() => {
              if (db.get(`sanction_${guild.id}`) === "ban") {
                guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              } else if (db.get(`sanction_${guild.id}`) === "kick") {
                guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })


              } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

                guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              }
            }).catch(err => { })
          } else {

          }


        }
      } else { }
    } else if (db.get(`roles_${guild.id}`) === "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      let maxt = true

      if (perm) {
        return
      } else if (!perm) {

        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
          member.roles.remove(role, `Antirole`).then(() => {
            if (db.get(`sanction_${guild.id}`) === "ban") {
              guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            } else if (db.get(`sanction_${guild.id}`) === "kick") {
              guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })


            } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

              guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              }).catch(err => {
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.addperm} ${member}`)
                embed.setColor(color)



                if (logChannel) logChannel.send({ embed: embed })
              })

            }
          }).catch(err => { })


        } else {
          if (maxt === true) {
            member.roles.remove(role, `Antirole`).then(() => {
              if (db.get(`sanction_${guild.id}`) === "ban") {
                guild.members.cache.get(action.executor.id).ban(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              } else if (db.get(`sanction_${guild.id}`) === "kick") {
                guild.members.cache.get(action.executor.id).kick(`Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })


              } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

                guild.members.cache.get(action.executor.id).roles.set([], `Antirole`).then(te => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                }).catch(err => {
                  const embed = new Discord.MessageEmbed()
                  embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} ${lang.addrole} ${member}`)
                  embed.setColor(color)



                  if (logChannel) logChannel.send({ embed: embed })
                })

              }
            }).catch(err => { })
          } else {

          }


        }
      } else { }
    }
  })
  client.on("channelCreate", async (channel) => {
    if (!channel.guild) return

    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = channel.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    let Muted = await db.fetch(`mRole_${channel.guild.id}`);
    let muteRole = await channel.guild.roles.cache.get(Muted) || channel.guild.roles.cache.find(role => role.name === `muet`) || channel.guild.roles.cache.find(role => role.name === `Muted`) || channel.guild.roles.cache.find(role => role.name === `Mute`)
    if (muteRole) {
      await channel.createOverwrite(muteRole, {
        SEND_channelS: false,
        CONNECT: false,
        ADD_REACTIONS: false
      }, `AutoConfig`)
    } else if (db.get(`channels_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        channel.delete(`Antichannel`)


      } else { }
    } else if (db.get(`channels_${guild.id}`) === true || "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschannelc}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        channel.delete(`Antichannel`)


      } else { }
    }
  })
  client.on("channelDelete", async (channel) => {
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = channel.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`channels_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_DELETE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          await channel.clone({
            name: channel.name,
            permissions: channel.permissionsOverwrites,
            type: channel.type,
            topic: channel.withTopic,
            nsfw: channel.nsfw,
            birate: channel.bitrate,
            userLimit: channel.userLimit,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissions: channel.withPermissions,
            position: channel.rawPosition,
            reason: `Antichannel`
          })
        } catch (error) {
          return;
        }

      } else { }
    } else if (db.get(`channels_${guild.id}`) === "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_DELETE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick({
            reason: `Antichannel`
          }).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschanneld} ${channel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          await channel.clone({
            name: channel.name,
            permissions: channel.permissionsOverwrites,
            type: channel.type,
            topic: channel.withTopic,
            nsfw: channel.nsfw,
            birate: channel.bitrate,
            userLimit: channel.userLimit,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissions: channel.withPermissions,
            position: channel.rawPosition,
            reason: `Antichannel`
          })
        } catch (error) {
          return;
        }

      } else { }
    }
  })
  client.on("channelUpdate", async (oldChannel, newChannel) => {
    if (oldChannel === newChannel) return

    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = oldChannel.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`channels_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          newChannel.edit({
            name: oldChannel.name,
            permissions: oldChannel.permissionsOverwrites,
            type: oldChannel.type,
            topic: oldChannel.withTopic,
            nsfw: oldChannel.nsfw,
            bitrate: oldChannel.bitrate,
            userLimi: oldChannel.userLimit,
            rateLlimitPerUser: oldChannel.rateLimitPerUser,
            permissions: oldChannel.withPermissions,
            position: oldChannel.rawPosition,
            reason: `Antichannel`
          })

        } catch (err) { }

      } else { }
    } else if (db.get(`channels_${guild.id}`) === "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antichannel`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logschannelm} ${oldChannel.name}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        try {
          newChannel.edit({
            name: oldChannel.name,
            permissions: oldChannel.permissionsOverwrites,
            type: oldChannel.type,
            topic: oldChannel.withTopic,
            nsfw: oldChannel.nsfw,
            bitrate: oldChannel.bitrate,
            userLimi: oldChannel.userLimit,
            rateLlimitPerUser: oldChannel.rateLimitPerUser,
            permissions: oldChannel.withPermissions,
            position: oldChannel.rawPosition,
            reason: `Antichannel`
          })

        } catch (err) { }

      } else { }
    }
  })
  client.on("guildMemberAdd", async (member) => {
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let logChannel = member.guild.channels.cache.get(db.get(`${member.guild.id}.raidlog`))
    let logChannel2 = member.guild.channels.cache.get(db.get(`${member.guild.id}.raidlog`))

    if (db.get(`crealimit_${member.guild.id}`)) {
      const ms = require("ms");
      const duration = ms(db.get(`crealimit_${member.guild.id}`).replace("j", "d"));
      let created = member.user.createdTimestamp;
      let sum = created + duration;
      let diff = Date.now() - sum;

      if (diff < 0) {

        member.kick().then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${member} ${lang.crealogs}`)
          if (logChannel) logChannel.send(embed)
        }).catch(err => { })


      }

    } else if (db.get(`antitoken_${member.guild.id}`) === "lock") {
      member.kick()
      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${member} à été **kick** pour avoir \`rejoint pendant que le serveur était verrouillé\``)
      if (logChannel) logChannel.send({ embed: embed })

    } else if (db.get(`antitoken_${member.guild.id}`) === true) {

      let maxMembers = "10";
      let maxTime = "180000";
      let last10Members = guild.members.cache.filter(m => m.joinedAt <= (Date.now() - maxTime))
      if (last10Members.size > maxMembers) return;
      console.log(last10Members.map(r => r.user.tag))
      last10Members.forEach(m => {
        m.kick({ reason: "Anti token" }).then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${m} ${lang.antitokenlogs}`)
          if (logChannel) logChannel.send({ embed: embed })
        }).catch(err => { })
      })

    } else if (member.user.bot) {

      if (db.get(`bot_${member.guild.id}`) === "max") {
        const action = await member.guild.fetchAuditLogs({ limit: 1, type: "BOT_ADD" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;
        let perm = member.guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd_${member.guild.id}_${action.executor.id}`) === true
        if (perm) {
          const B4 = new MessageButton()
            .setStyle('red')
            .setID('kick')
            .setLabel('Expulser')


          const interactiveButtons = new MessageActionRow()

            .addComponent(B4)
          const constembed = new Discord.MessageEmbed()
          constembed.setDescription(`${action.executor.username} vient d'inviter le bot ${member} (${member.id})`)
          constembed.setColor(color)

          if (logChannel) logChannel.send({ components: [interactiveButtons], embed: constembed }).then(async m => {


            client.on('clickButton', async (button) => {
              if (member.guild.owner.id == button.clicker.user.id || process.env.owner == button.clicker.user.id || db.get(`${button.clicker.user.id}.ownermd`) === true) {

                if (button.id === "kick") {
                  member.kick().then(() => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`Le bot ${member.username} a bien été expulsé par ${action.executor.username}`)
                    embed.setColor(color)


                    if (logChannel) logChannel.send({ embed: embed })
                  }).catch(err => {

                    if (logChannel) logChannel.send(`Il semblerait que je n'ai pas les permissions nécessaire pour **kick** ce bot`)
                  })
                  button.reply.defer(true);
                }
              }
            })
          })

        } else if (!perm) {
          if (db.get(`sanction_${member.guild.id}`) === "ban") {
            member.guild.members.cache.get(action.executor.id).ban(`Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          } else if (db.get(`sanction_${member.guild.id}`) === "kick") {
            member.guild.members.cache.get(action.executor.id).kick(`Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })


          } else if (db.get(`sanction_${member.guild.id}`) === "derank" || null) {

            member.guild.members.cache.get(action.executor.id).roles.remove(member.guild.members.cache.get(action.executor.id).roles.cache.array(), `Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          }
          try {
            member.kick("Antibot")
          } catch (err) { }

        } else { }
      } else if (db.get(`bot_${member.guild.id}`) === true) {
        const action = await member.guild.fetchAuditLogs({ limit: 1, type: "BOT_ADD" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;
        let perm = member.guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd_${member.guild.id}_${action.executor.id}`) === true || db.get(`wlmd_${member.guild.id}_${action.executor.id}`) === true
        if (perm) {
          const B4 = new MessageButton()
            .setStyle('red')
            .setID('kick')
            .setLabel('Expulser')


          const interactiveButtons = new MessageActionRow()

            .addComponent(B4)
          const constembed = new Discord.MessageEmbed()
          constembed.setDescription(`${action.executor.username} vient d'inviter le bot ${member} (${member.id})`)
          constembed.setColor(color)

          if (logChannel) logChannel.send({ components: [interactiveButtons], embed: constembed }).then(async m => {


            client.on('clickButton', async (button) => {
              if (member.guild.owner.id == button.clicker.user.id || process.env.owner == button.clicker.user.id || db.get(`${button.clicker.user.id}.ownermd`) === true) {

                if (button.id === "kick") {
                  member.kick().then(() => {
                    const embed = new Discord.MessageEmbed()
                    embed.setDescription(`Le bot ${member.username} a bien été expulsé par ${action.executor.username}`)
                    embed.setColor(color)


                    if (logChannel) logChannel.send({ embed: embed })
                  }).catch(err => {

                    if (logChannel) logChannel.send(`Il semblerait que je n'ai pas les permissions nécessaire pour **kick** ce bot`)
                  })
                  button.reply.defer(true);
                }
              }
            })
          })


        } else if (!perm) {
          if (db.get(`sanction_${member.guild.id}`) === "ban") {
            member.guild.members.cache.get(action.executor.id).ban(`Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          } else if (db.get(`sanction_${member.guild.id}`) === "kick") {
            member.guild.members.cache.get(action.executor.id).kick(`Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })


          } else if (db.get(`sanction_${member.guild.id}`) === "derank" || null) {

            member.guild.members.cache.get(action.executor.id).roles.remove(member.guild.members.cache.get(action.executor.id).roles.cache.array(), `Antibot`).then(te => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            }).catch(err => {
              const embed = new Discord.MessageEmbed()
              embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.botlog} ${member.tag}\``)
              embed.setColor(color)



              if (logChannel) logChannel.send({ embed: embed })
            })

          }
          try {
            member.kick("Antibot")
          } catch (err) { }

        } else { }
      } else { }
    }
  })
  client.on("webhookUpdate", async (channel) => {
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    let guild = channel.guild
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))

    if (db.get(`webhooks_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }



      } else { }
    } else if (db.get(`webhooks_${guild.id}`) === "max") {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiwebhook`).then(te => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const channels = channel.guild.channels.cache.filter(ch => ch.type !== 'category');
            channels.forEach(async channele => {
              await channele.clone({
                name: channele.name,
                permissions: channele.permissionsOverwrites,
                type: channele.type,
                topic: channele.withTopic,
                nsfw: channele.nsfw,
                birate: channele.bitrate,
                userLimit: channele.userLimit,
                rateLimitPerUser: channele.rateLimitPerUser,
                permissions: channele.withPermissions,
                position: channele.rawPosition,
                reason: `Antiwebhook`
              })
                .catch(err => { })
              channele.delete().catch(err => { })
            })
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.logswebhook}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
      }
    }
  })
  client.on("guildBanAdd", async (guild, user) => {

    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`massban_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        guild.members.unban(user, `Antiban`)


      } else { }
    } else if (db.get(`massban_${guild.id}`) === "max") {

      const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.baner} ${user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }
        guild.members.unban(user, `Antiban`)

      } else { }
    }
  })
  client.on("guildMemberRemove", async (member) => {
    let guild = member.guild
    let color = db.get(` ${process.env.owner}.color`)
    if (color === null) color = process.env.color
    if (!guild.me.hasPermission("ADMINISTRATOR")) return

    let logChannel = guild.channels.cache.get(db.get(`${guild.id}.raidlog`))
    if (db.get(`massban_${guild.id}`) === true) {
      const action = await guild.fetchAuditLogs({ limit: 1, type: "KICK_MEMBERS" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true || db.get(`${guild.id}.${action.executor.id}.wlmd`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }


      } else { }
    } else if (db.get(`massban_${guild.id}`) === "max") {

      const action = await guild.fetchAuditLogs({ limit: 1, type: "KICK_MEMBERS" }).then(async (audit) => audit.entries.first());
      if (action.executor.id === client.user.id) return;
      let perm = guild.owner.id == action.executor.id || process.env.owner == action.executor.id || db.get(`ownermd.${action.executor.id}`) === true
      if (perm) {
        return
      } else if (!perm) {
        if (db.get(`sanction_${guild.id}`) === "ban") {
          guild.members.cache.get(action.executor.id).ban(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **ban** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **ban** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        } else if (db.get(`sanction_${guild.id}`) === "kick") {
          guild.members.cache.get(action.executor.id).kick(`Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **kick** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **kick** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })


        } else if (db.get(`sanction_${guild.id}`) === "derank" || null) {

          guild.members.cache.get(action.executor.id).roles.set([], `Antiban`).then(te => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${action.executor} ${lang.logsyes} **derank** ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          }).catch(err => {
            const embed = new Discord.MessageEmbed()
            embed.setDescription(`${lang.logserror} **derank** ${action.executor} ${lang.logsr} \`${lang.kicker} ${member.user.tag}\``)
            embed.setColor(color)



            if (logChannel) logChannel.send({ embed: embed })
          })

        }

      } else { }
    }
  })
} catch (err) {
}

process.on("unhandledRejection", err => {console.log(err);})

client.login(process.env.TOKEN);