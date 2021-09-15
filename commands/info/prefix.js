	const { prefix: defaultPrefix, token } = require('../../config.js').bot
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { MessageButton } = require("discord-buttons");
const emoji = require("../../emoji.json");
module.exports = {
    name: "setprefix",
        aliases: ['prefix'],
    usage: 'setprefix',
    description: 'Change your server prefix',
    run: async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`${emoji.shieldd} Custom Prefix`)
      .setDescription('To get a custom server prefix please visit [here](https://discordtownshop.com/dashboard)').setImage('https://cdn.discordapp.com/attachments/870970803586465832/872417739770302474/1PyM5eBfN3YXjuZzKgyRa_g.png')
      .setColor('386bd7')
    message.channel.send(embed)
  }
}