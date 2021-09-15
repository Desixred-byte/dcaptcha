const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name : 'top-guilds',
    run : async(client, message, args) => {



            const guilds = client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .first(35);
    
            const description = guilds.map((guild, index) => {
               return `${index+1}) **Server ID**\n${guild.id}\n**Server name**\n${guild.name}\n**Server members**\n${guild.memberCount}\n\n\n`
            }).join('\n')
    
            message.channel.send(
                new MessageEmbed()
                .setTitle(`${client.user.username}'s top Guilds`)
                .setThumbnail("https://cdn.discordapp.com/avatars/790269534141284454/b15a9f7480d7a59380e82f3467fe84fa.webp?size=4096")
                .setColor("386bd7")
                .setDescription(description)
            )
    }
}