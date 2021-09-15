const emoji = require('../../emoji.json')
 module.exports = {
	name: 'verify',
	description: 'Verify yourself.',
	aliases: ['vrf'],
	run: async (client, message, args, db) => {
		let verified = db.get(`verified_${message.guild.id}_${message.author.id}`);
		if (!verified) client.emit('guildMemberAdd', message.member);
		if (verified) message.channel.send(new MessageEmbed()
    .setDescription(`${emoji.error} You are already verified!`))
	}
};
