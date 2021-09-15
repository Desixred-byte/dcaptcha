	const { prefix: defaultPrefix, token } = require('../../config.js').bot
  const { MessageEmbed } = require('discord.js');
const emoji = require('../../emoji.json')
const fetch = require('node-fetch');
const { MessageButton } = require("discord-buttons");

module.exports = {
    name: "whois",
      aliases: ['userinfo'],
  description: 'Get a detailed information of a selected user.\nAlso sends their banner.',
  usage: 'whois <@tag>',
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let status;
        switch (user.presence.status) {
            case "online":
                status = `${emoji.online} Online`;
                break;
            case "dnd":
                status = `${emoji.dnd} DND`;
                break;
            case "idle":
                status = `${emoji.idle} Idle`;
                break;
            case "offline":
                status = `${emoji.offline} Offline`;
                break;
        }

                let uid = user.id


        let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ODM3NTU0MzUyODQ2NjY3ODI2.YIuPRg.NkNQGrO9Kl8zLDnDBVVEGEq0SGM`
            }
            
        })

        let receive = ''
        let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif'

        response.then(a => {
            if (a.status !== 404) {
                a.json().then(data => {
                    receive = data['banner']

                    if (receive !== null) {

                        let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bot ODM3NTU0MzUyODQ2NjY3ODI2.YIuPRg.U3hj3ebpvBq7VmDiVM8WCcyilHs` // Fit it to your config here
                            }
                        })
                        let statut = ''
                        response2.then(b => {
                            statut = b.status

                            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                            if (statut === 415) {
                                banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                            }

                        })
                    }
                })
            }
        })

        const embed = new MessageEmbed()
            .setTitle(`${emoji.info} ${user.user.username} infos`)
            .setColor(`7289da`)
            .setThumbnail(user.user.displayAvatarURL({dynamic : true}))
            .addFields(
                {
                    name: `${emoji.mention} Name: `,
                    value: user.user.username,
                    inline: true
                },
                {
                    name: `${emoji.channel} Discriminator: `,
                    value: `#${user.user.discriminator}`,
                    inline: true
                },
                {
                    name: `${emoji.active} Current Status: `,
                    value: status,
                    inline: true
                },
                {
                    name: `${emoji.id} ID: `,
                    value: user.user.id,
                },
                {
                    name: `${emoji.desktop} Activity: `,
                    value: user.presence.activities[0] ? user.presence.activities[0].name : `No game`,
                    inline: true
                },
                {
                    name: `${emoji.inbox} Creation Date: `,
                    value: user.user.createdAt.toLocaleDateString("en-us"),
                    inline: true
                },
                {
                    name: `${emoji.join} Joined Date: `,
                    value: user.joinedAt.toLocaleDateString("en-us"),
                    inline: true
                },
                {
                    name: `${emoji.mention} User Roles: `,
                    value: user.roles.cache.map(role => role.toString()).join(" ,"),
                    inline: true
                }
              
            )
  setTimeout(() => {
             let embed = new MessageEmbed()
             .setTitle(`${user.user.username}'s Banner`)
             .setDescription(`${emoji.pen} If a banner does not show it's because the user does not have a banner set.`)
                .setColor('7289da')
                .setImage(banner)
                                message.channel.send(embed)    
             }, 1000)

                 const button = new MessageButton()
      .setStyle("url")
      .setURL(`${banner}`)
      .setLabel("Banner URL")
      message.channel.send({ buttons: button, embed: embed })
              
     

        
    }
}