	const { prefix: defaultPrefix, token } = require('../../config.js').bot
  const Discord = require("discord.js");
const fetch = require("node-fetch");
const { MessageButton } = require("discord-buttons");
const db = require('quick.db')
const emoji = require("../../emoji.json");
module.exports = {
    name: "changelog",
    aliases: ['updates'],
    usage: '',
    description: 'Change log of dcaptcha',
    run: async (client, message, args) => {
      let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;
    const embed = new Discord.MessageEmbed()
    .setAuthor(`discordtownshop.com/changelog`)
   .addField(`**Bot Verification**` , `> [From now on when you invite a bot dcaptcha won't make them verify!](https://discordtownshop.com/changelog)`)
   .addField(`**Timeout Punishment**` , `> [Lately the punishment for not completing the captcha was not working. Dcaptcha will now be able to kick or ban a member if they do not complete the captcha.](https://discordtownshop.com/changelog)`)
      .setColor('386bd7')
    message.channel.send(embed)
  },
};