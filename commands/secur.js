const Discord = require('discord.js')
const db = require('quick.db')
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
const ms = require('ms')

module.exports = {
  name: 'secur',
  aliases: [],
  run: async (client, message, args) => {
    let prefix = db.get(` ${process.env.owner}.prefix`)
    if (prefix === null) prefix = process.env.prefix;
    let color = db.get(`${process.env.owner}.color`)
    if (color === null) color = process.env.color
    var guild = message.guild
        if(!guild.me.hasPermission("ADMINISTRATOR")){
 return;
            }
    if (process.env.owner === message.author.id   || db.get(`ownermd.${message.author.id}`) === true || db.get(`${message.guild.id}.${message.author.id}.wlmd`) === true ) {

      if (args[0] === "invite") {
        if (args[1] === "on") {

        } else if (args[1] === "off") {

        } else { }
      } else if (!args[0]) {
        let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
        if (!lograid) lograid = "`off`"
        let antiwb = db.get(`webhooks_${message.guild.id}`)
        if (antiwb === null) antiwb = "off"
        if (antiwb === true) antiwb = "on"
        if (antiwb === "max") antiwb = "max"
        let antichannel = db.get(`channels_${message.guild.id}`)
        if (antichannel === null) antichannel = "off"
        if (antichannel === true) antichannel = "on"
        if (antichannel === "max") antichannel = "max"
        let antirole = db.get(`roles_${message.guild.id}`)
        if (antirole === null) antirole = "off"
        if (antirole === true) antirole = "on"
        if (antirole === "max") antirole = "max"
        let antibot = db.get(`bot_${message.guild.id}`)
        if (antibot === null) antibot = "off"
        if (antibot === true) antibot = "on"
        if (antibot === "max") antibot = "max"
        let antiupdate = db.get(`update_${message.guild.id}`)
        if (antiupdate === null) antiupdate = "off"
        if (antiupdate === true) antiupdate = "on"
        if (antiupdate === "max") antiupdate = "max"
        let antieveryone = db.get(`everyone_${message.guild.id}`)
        if (antieveryone === null) antieveryone = "off"
        if (antieveryone === true) antieveryone = "on"
        let crealimit = db.get(`crealimit_${message.guild.id}`)
        if (crealimit === null) crealimit = "0s"
        let antiban = db.get(`massban_${message.guild.id}`)
        if (antiban === null) antiban = "off"
        if (antiban === true) antiban = "on"
        if (antiban === "max") antiban = "max"
        let antiunban = db.get(`massunban_${message.guild.id}`)
        if (antiunban === null) antiunban = "off"
        if (antiunban === true) antiunban = "on"
        if (antiunban === "max") antiunban = "max"
        let antitoken = db.get(`antitoken_${message.guild.id}`)
        if (antitoken === null) antitoken = "off 10 / 3m"
        if (antitoken === true) antitoken = "on 10 / 3m"


        const embed = new Discord.MessageEmbed()

          .setTitle('**SECURITY**')
          .setDescription(`**Log de raid :** ${lograid}\n**Creation limit :** \`${crealimit}\`\n**Antibot :** \`${antibot}\`\n**Antiwebhook :** \`${antiwb}\`\n**Antiupdate :** \`${antiupdate}\`\n**Antichannel :** \`${antichannel}\`\n**Antirole :** \`${antirole}\`\n**Antiunban :** \`${antiunban}\`\n**Antieveryone :** \`${antieveryone} 3 / 1h\`\n**Antiban :** \`${antiban} 3 / 1m\`\n**Antitoken :** \`${antitoken}\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || "derank"}\``)
          .setColor(color)

          .setFooter(`${client.user.username}`)

        return message.channel.send(embed)
      }


      if (args[0] === "on") {


        await sleep(250)
        let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
        if (!lograid) lograid = "`off`"
        const embed = new Discord.MessageEmbed()
          .setTitle('**SECURITY**')
          .setDescription(`**Log de raid :** ${lograid}\n**Creation limit :** \`3j\`\n**Antibot :** \`on\`\n**Antiwebhook :** \`on\`\n**Antiupdate :** \`on\`\n**Antichannel :** \`on\`\n**Antirole :** \`on\`\n**Antiunban :** \`on\`\n**Antieveryone :** \`on 3 / 1h\`\n**Antiban :** \`on 3 / 1m\`\n**Antitoken :** \`on\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || "derank"}\``)
          .setColor(color)
          .setFooter(`${client.user.username}`)
        message.channel.send(embed)
        db.set(`massunban_${message.guild.id}`, true)
        db.set(`crealimit_${message.guild.id}`, "3j")
        db.set(`antitoken_${message.guild.id}`, true)
        db.set(`webhooks_${message.guild.id}`, true)
        db.set(`channels_${message.guild.id}`, true)
        db.set(`roles_${message.guild.id}`, true)
        db.set(`bot_${message.guild.id}`, true)
        db.set(`update_${message.guild.id}`, true)
        db.set(`everyone_${message.guild.id}`, true)
        db.set(`antispam_${message.guild.id}`, true)

        db.set(`massban_${message.guild.id}`, true)
        db.set(`link_${message.guild.id}`, true)
        return db.set(`typelink_${message.guild.id}`, " invite")

      }

      if (args[0] === "off") {


        let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
        if (!lograid) lograid === "`off`"

        const embed = new Discord.MessageEmbed()
          .setTitle('**SECURITY**')
          .setDescription(`**Log de raid :** ${lograid}\n**Creation limit :** \`0s\`\n**Antibot :** \`off\`\n**Antiwebhook :** \`off\`\n**Antiupdate :** \`off\`\n**Antichannel :** \`off\`\n**Antirole :** \`off\`\n**Antiunban :** \`off\`\n**Antieveryone :** \`off 3 / 1h\`\n**Antiban :** \`off 3 / 1m\`\n**Antitoken :** \`off 10 / 3m\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || "derank"}\``)
          .setColor(color)
          .setFooter(`${client.user.username}`)
        message.channel.send(embed)
        db.set(`antispam_${message.guild.id}`, null)
        db.set(`massunban_${message.guild.id}`, null)
        db.set(`crealimit_${message.guild.id}`, null)
        db.set(`typelink_${message.guild.id}`, null)
        db.set(`crealimit_${message.guild.id}`, null)
        db.set(`antitoken_${message.guild.id}`, null)
        db.set(`link_${message.guild.id}`, null)
        db.set(`webhooks_${message.guild.id}`, null)
        db.set(`channels_${message.guild.id}`, null)
        db.set(`roles_${message.guild.id}`, null)
        db.set(`bot_${message.guild.id}`, null)
        db.set(`update_${message.guild.id}`, null)
        db.set(`everyone_${message.guild.id}`, null)
        return db.set(`massban_${message.guild.id}`, null)
      }
      if (args[0] === "max") {

        await sleep(250)
        let lograid = message.guild.channels.cache.get(db.get(`${message.guild.id}.raidlog`))
        if (!lograid) lograid = "`off`"
        const embed = new Discord.MessageEmbed()
          .setTitle('**SECURITY**')
          .setDescription(`**Log de raid :** ${lograid}\n**Creation limit :** \`1j\`\n**Antibot :** \`max\`\n**Antiwebhook :** \`max\`\n**Antiupdate :** \`max\`\n**Antichannel :** \`max\`\n**Antirole :** \`max\`\n**Antiunban :** \`max\`\n**Antieveryone :** \`on 1 / 1h\`\n**Antiban :** \`max 1 / 1m\`\n**Antitoken :** \`10 / 10m\`\n**Punition :** \`${db.get(`sanction_${message.guild.id}`) || "derank"}\``)
          .setColor(color)
          .setFooter(`${client.user.username}`)
        message.channel.send(embed)
        db.set(`massunban_${message.guild.id}`, "max")
        db.set(`sanction_${message.guild.id}`, "kick")
        db.set(`crealimit_${message.guild.id}`, "1j")
        db.set(`link_${message.guild.id}`, "max")
        db.set(`webhooks_${message.guild.id}`, "max")
        db.set(`channels_${message.guild.id}`, "max")
        db.set(`roles_${message.guild.id}`, "max")
        db.set(`bot_${message.guild.id}`, "max")
        db.set(`update_${message.guild.id}`, "max")
        db.set(`antitoken_${message.guild.id}`, "max")
        db.set(`massban_${message.guild.id}`, "max")
        return db.set(`typelink_${message.guild.id}`, " all")

      }
    } else {

    }

  }
}