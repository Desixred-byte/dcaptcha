const Client = require('../../Structures/legendJsClient.js'),
	Discord = require('discord.js'),
	{ prefix: defaultPrefix, token } = require('../../config.js').bot,
	client = new Client({ disableMentions: 'everyone' }),
	db = require('quick.db'),
	dashboard = require('../../dashboard/index'),
	moment = require('moment'),
	config = require('../../config.js');
  const emoji = require('../../emoji.json')
  
  const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'config',
	description: 'Configure your server settings.',
aliases: ['settings'],
	run: async (client, message, args, db) => {

		if (!message.channel.permissionsFor(message.author).has('SEND_MESSAGES'))
			return message.channel.send(new MessageEmbed()
				.setDescription(`${emoji.error} | You dont have permissions to use this command!`)
				.setColor('386bd7')
			);
		let options = ['warningchannel', 'logs', 'punishment', 'role', 'show', 'toggle'];
		function check(opt, array) {
			return array.some(x => x.toLowerCase() === opt.toLowerCase());
		}
		if (!args[0]) {
     	if (message.author.bot) return;
	if (!message.guild) return;
	let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.members.fetch(message);

			return message.channel.send(new MessageEmbed()
      .setTitle('Invalid Arguements')
		.setDescription(`Please provide a selection , all of them are displayed below!`)
    .addField(`${emoji.settings} Selections` , '`warningchannel` | `logs` | `punishment` | `role` | `show` | `toggle`')
    .addField(`${emoji.success} Too hard?` , `Too complicated configuration? DCaptcha bot does have a dashboard too.\nClick [here](https://discordtownshop.com/dashboard/${message.guild.id}) to configure your server settings.`)
    .setColor('386bd7')
			);
		}
		if (!check(args[0], options)) {
			return message.channel.send(new MessageEmbed()
				.setColor('386bd7')
        .setTitle(`${emoji.error} Invalid Arguement`)
        .setDescription(`Given selection option is invalid , current ones are listed below.\nMake sure to add spaces , Example : \`p/config role\``)
        .addField(`${emoji.settings} Selection Options` , '`warningchannel` | `logs` | `punishment` | `role` | `show` | `toggle`')
			);
		}
		let channel = message.mentions.channels.first();
		switch (args[0]) {
			case 'warningchannel':
				if (!channel) {
					return message.channel.send(`${emoji.error} | **Specify the channel**`);
				}
				db.set(`warningchannel_${message.guild.id}`, channel.id);
				return message.channel.send(`${emoji.success} **The Warning Channel has been set.**`);
				break;
			case 'logs':
				if (!channel) {
					return message.channel.send(`${emoji.success}  | **Specify the channel**`);
				}
				db.set(`logs_${message.guild.id}`, channel.id);
				return message.channel.send(`${emoji.success} **The logs channel has been set.**'`);
				break;
			case 'role':
				let role =
					message.mentions.roles.first() ||
					message.guild.roles.cache.get(args[1]);
				if (!role) {
					return message.channel.send(':x: | **Specify the role**');
				}
				db.set(`role_${message.guild.id}`, role.id);
				return message.channel.send(`${emoji.success} **The verification role has been set.**`);
				break;
			case 'show':
				let warningChan =
					message.guild.channels.cache.get(
						db.get(`warningchannel_${message.guild.id}`)
					) || 'None';
				let logsChan =
					message.guild.channels.cache.get(
						db.get(`logs_${message.guild.id}`)
					) || 'None';
				let verificationRole =
					message.guild.roles.cache.get(db.get(`role_${message.guild.id}`)) ||
					'None';
				let punish = db.get(`punishment_${message.guild.id}`) || 'None';
				let embed = new Discord.MessageEmbed()
					.setTitle('Configuration')
					.setDescription(
						'The configuration for this server is displayed below.'
					)
					.addField('Punishment', punish)
					.addField('Warning Channel', warningChan)
					.addField('Logs Channel', logsChan)
					.addField('Verification Role', verificationRole)
					.setColor('386bd7')
					.setFooter(message.guild.name,
						message.guild.iconURL({ dynamic: true })
					);
				return message.channel.send({ embed: embed });
				break;
			case 'punishment':
				const punishment = args[1].toLowerCase().trim();
				const punishments = ['kick', 'ban'];
				if (!punishment)
					return message.channel.send(`${emoji.error} Please enter a punishment.`);
				if (!punishments.includes(punishment))
					return message.channel.send(
						`The **punishment** argument must be one of these:\n${punishments
							.map(x => `**${x}**`)
							.join(', ')}`
					);
				db.set(`punishment_${message.guild.id}`, punishment);
				return message.channel.send(
					`${emoji.success} The punishment for **${
						message.guild.name
					}** has been set to: **${punishment}**`
				);
				break;
		}
	}
};
