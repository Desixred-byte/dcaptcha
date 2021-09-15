const { Client, Message, MessageEmbed } = require('discord.js');
const emoji = require('../../emoji.json')

module.exports = {
    name: 'leave-guild',
    run: async(client, message, args) => {

	if (
			!require("../../blacklist-config.json").owner.includes(
			  message.author.id
			)
		  )
			return;
        
      
      const guildId = args[0];
        if (!guildId) return message.channel.send('Please provide a valid server ID');
        const guild = message.client.guilds.cache.get(guildId);
        if (!guild) return message.channel.send(`${emoji.error} Unable to find server, please check the provided ID`);
        await guild.leave();
        const embed = new MessageEmbed()

          .setTitle('left a Guild')
          .setDescription(`${emoji.success} I have successfully left **${guild.name}**.`)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor('386bd7');
        message.channel.send(embed);
    }
}