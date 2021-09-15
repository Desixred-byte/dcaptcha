	const { prefix: defaultPrefix, token } = require('../../config.js').bot
  const Discord = require("discord.js");
const fetch = require("node-fetch");
const { MessageButton } = require("discord-buttons");
const db = require('quick.db')
const emoji = require("../../emoji.json");
module.exports = {
    name: "invite",
    aliases: ['inv'],
    usage: 'invite',
    description: 'Invite DCaptcha to your server.',
    run: async (client, message, args) => {
      let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;
    const embed = new Discord.MessageEmbed()
    .setTitle(`Invite DCaptcha`)
   .addField(`${emoji.link} **Want a verification bot?**` , `Do you want a advanced verification bot to prevent your server from bots and raids? You can do all of that with out bot DCaptcha.\nClick [here](https://discordtownshop.com/invite)`)
   .addField(`${emoji.info} **How to setup?**` , `You can configure your server verification settings from DCaptcha's [web dashboard](https://discordtownshop.com/login)!\nOr you can setup the verification system with a command.\nType \`${prefix}help verification\`\nIf you need more help join our [support](https://discord.gg/4hQN3XUKJ3) server!`)
      .setImage('https://cdn.discordapp.com/attachments/873295390403854337/886556796305690655/workfeatured-recaptcha.png')
      .setColor('386bd7')
    message.channel.send(embed)
  },
};