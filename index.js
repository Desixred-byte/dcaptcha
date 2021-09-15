//Verification bot by legendjs >:D
const Client = require('./Structures/legendJsClient.js'),
	Discord = require('discord.js'),
	{ prefix: defaultPrefix, token } = require('./config').bot,
	client = new Client({ disableMentions: 'everyone' }),
	db = require('quick.db'),
	dashboard = require('./dashboard/index'),
	moment = require('moment'),
	config = require('./config');
  const { MessageEmbed } = require('discord.js')

client.loadCommands();


console.log('-------------------------------------');
//this took me some time so dont you dare remove credits, if u do remove credits then you will have copy right issues.
client.on('ready', () => {
	console.log(`[INFO]: Ready on client (${client.user.tag})`);
	console.log(
		`[INFO]: watching ${client.guilds.cache.size} Servers, ${
			client.channels.cache.size
		} channels & ${client.users.cache.size} users`
	);
	console.log('-------------------------------------');
	client.user.setActivity('Captcha | discordtownshop.com/invite', {
		type: 'WATCHING'
	});
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.members.fetch(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) command.run(client, message, args, db);
});

client.on('guildMemberAdd', async member => {
	let { guild, user } = member;
  if(message.author.id === client.user.id) return; 
	let prefix = db.get(`prefix_${member.guild.id}`) || defaultPrefix;
	let bypassed = db.get(`bypass_${guild.id}`) || [];
	if (bypassed.includes(user.id)) return;
	let warningChan = member.guild.channels.cache.get(
		db.get(`warningchannel_${member.guild.id}`)
	);
	let logsChan = member.guild.channels.cache.get(
		db.get(`logs_${member.guild.id}`)
	);


	let embed = new Discord.MessageEmbed()
		.setTitle(`Verification Logs`)
		.setDescription(`Member Joined`)
		.setFooter(member.guild.name, member.guild.iconURL())
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
		.addField(
			`Account Age`,
			`Created ${moment(member.user.createdAt).fromNow()}`
		)
		.setColor(
			`${
				Date.now() - member.user.createdAt < 60000 * 60 * 24 * 7
					? '#386bd7'
					: '#386bd7'
			}`
		); //sets the color to red if the account age is less then a week else it sets it to green //
    
	logsChan.send({ embed: embed }).catch(err => {});
	member.user
		.send(new MessageEmbed()
 .setColor('386bd7')
 .setAuthor(`DCaptcha | Welcome to ${member.guild.name}`)
 .setTitle(`Server Verification`)
 .setDescription(`This server is protected by DCaptcha.\nTo verify your account, please visit [here](https://${config.website.domain}/verify/${member.guild.id}) and solve the given captcha.\nYou have **15** minutes to complete verification , the verification will be reset and you will be kicked within 15 minutes of **inactivity**.`)
 .addField(`Verification Server` , `${member.guild.name}`)
.setImage('https://cdn.discordapp.com/attachments/818019345078419486/864549367825039370/verification_screen.PNG')
.setFooter('DCaptcha')
.setTimestamp()

	)
		.catch(err => {
			warningChan.send(new MessageEmbed()
				.setTitle('Uh oh')
				.setDescription(`<@${member.user.id}>\nIt looks like your DM(s) are disabled, please enable them and use the \`${prefix}verify\` command again.`)
				.setImage('https://cdn.discordapp.com/attachments/870979813593186366/872016575522291712/image0.png')
				.setColor('386bd7')
			);
		});
	warningChan
		.send(new MessageEmbed()
		.setAuthor(`Captcha Verification | ${guild.name}`)
		.setTitle(`Verify your account ${member.user.tag}!`)
			.setDescription(`This server is protected by **DCaptcha**!\n> To gain access to this server you **must** verify your account by completing Captcha for security purposes!\nCan't verify? Got 404 Error? Check out the image below and make sure you have your DM(s) enabled to continue with the verification.`)
			.setImage('https://cdn.discordapp.com/attachments/873295386603814922/873503458165133332/1cfe16b21b3803ea739d6558bbee5ca7.png')
			.setFooter(`Verification System`)
			.setColor('386bd7')
	)

		.catch(err => {});
	//totally didnt steal these messages from AltDentifier
	setTimeout(function() {
		if (!member) return;
		if (db.get(`verified_${guild.id}_${user.id}`) || false) {
			return;
		} else {
			let kicked = true;
			member.user
				.send(new MessageEmbed()
				.setColor('386bd7')
				
				.setDescription('You have been kicked from the server for not verifying your account!')
				)
				.catch(err => {});
			member.kick().catch(err => {
				kicked = false;
			});
			let embed = new Discord.MessageEmbed()
				.setTitle(`Verification Logs`)
				.setDescription(`Member kicked`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Reason', 'User did not verify their account in time.')
				.setColor('#386bd7');

			let embed2 = new Discord.MessageEmbed()
				.setTitle(`Verification Logs`)
				.setDescription(`Failed to kick member.`)
				.setFooter(member.guild.name, member.guild.iconURL())
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
				.addField('Reason', 'Member did not verify in time.')
				.setColor('#386bd7');
			if (kicked) return logsChan.send({ embed: embed });
			else return logsChan.send({ embed: embed2 });
		}
	}, 60000 * 15);
});


// MEMBER REMOVE EVENT //
client.on('guildMemberRemove', async member => {
  db.delete(`ip_${member.guild.id}_${member.user.id}`);
	db.delete(`verified_${member.guild.id}_${member.user.id}`);
});


client.on('message', message => {
    if (message.content.startsWith('v!setupembed')) {
      message.channel.send(new MessageEmbed()
      .setAuthor('DCaptcha Captcha')
       .setTitle('Gain access to this server!')
       .setDescription('> In order to gain acess to this server you must complete a captcha on our website. Please check your direct messages for the link.\n**If you will not solve the captcha in 15 minutes you will be kicked automatically!**')
       .setFooter('Captcha Solutions')
      
       .setImage('https://cdn.discordapp.com/attachments/873295390403854337/886556796305690655/workfeatured-recaptcha.png')
       .setColor('386bd7')
      )
    }
})

client.login(token).catch(err => {
	console.log('[ERROR]: Invalid Token Provided');
});
dashboard(client);
