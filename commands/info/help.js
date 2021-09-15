	const { prefix: defaultPrefix, token } = require('../../config.js').bot
  const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const db = require('quick.db')
const {
    readdirSync
} = require("fs");
const invite = require("../../blacklist-config.json").invite;
let color = "#386bd7"
const emoji = require('../../emoji.json')

module.exports = {
    name: "help",
    description: "Shows all available bot commands.",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String} args 
     * @returns 
     */
    run: async (client, message, args) => {
	let prefix = db.get(`prefix_${message.guild.id}`) || defaultPrefix;

        if (!args[0]) {
            let categories = [];


            //categories to ignore
            let ignored = [
                'owner-only',
            ];

            const emo = {
                verification: emoji.settings,
                info: emoji.info,
                antialts: emoji.leave,
            }

            readdirSync("./commands/").forEach((dir) => {
                if (ignored.includes(dir.toLowerCase())) return;
                const name = `${emo[dir.toLowerCase()]} ${dir.toUpperCase()}`
                let cats = new Object();

                cats = {
                    name: name,
                    value: `\`${prefix}help ${dir.toLowerCase()}\``,
                    inline: true
                }


                categories.push(cats);
            });

            let embed = new MessageEmbed()
                .setTitle(`${emoji.dcaptcha} DCaptcha System`)
                .setDescription(
                    `\`\`\`fix\nCurrent server Prefix: ${prefix}\nParameters: <> = required, [] = optional\`\`\`\n[**Dashboard**](https://discordtownshop.com/dashboard/${message.guild.id})  | [Invite](https://discordtownshop.com/invite)  | [Support Server](${invite})\n\nTo check out a category, use command \`${prefix}help [category]\`\n\n__**Categories**__`
                )
               
                .addFields(categories)
                .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(color);

            return message.channel.send(embed);
        } else {
            let cots = [];
            let catts = [];

            readdirSync("./commands/").forEach((dir) => {
                if (dir.toLowerCase() !== args[0].toLowerCase()) return;
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );


                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return "No command name.";

                    let name = file.name.replace(".js", "");

                    let des = client.commands.get(name).description;

                    let obj = {
                        cname: `\`${name}\``,
                        des
                    }

                    return obj;
                });

                let dota = new Object();

                cmds.map(co => {
                    dota = {
                        name: `**${cmds.length === 0 ? "In progress." : co.cname}**`,
                        value: `${co.des ? co.des : 'No Description'}`,
                        inline: true,
                    }
                    catts.push(dota)
                });

                cots.push(dir.toLowerCase());
            });


            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );

            if (cots.includes(args[0].toLowerCase())) {
                const combed = new MessageEmbed()
                    .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Category__`)
                    .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n[**Dashboard**](https://discordtownshop.com/dashboard/${message.guild.id})  | [Invite](https://discordtownshop.com/invite)  | [Support Server](${invite})`)
                    .addFields(catts)
                    .setColor(color)

                return message.channel.send(combed)
            }

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`That is an invalid category/command.\nTry again or use \`${prefix}help\`.`)
                    .setColor("2f3136");
                return message.channel.send(embed);
            }

            const commandCooldown =  ((command.timeout % 60000) / 1000).toFixed(0) + 's';
            const embed = new MessageEmbed()
                .setTitle("Command Details:")
                .setDescription(`
                **Command:** ${ command.name ? command.name : "No name for this command."}
                **Description:** ${ command.description ?  command.description : "No description for this command." }
                **Aliases:** ${command.aliases ? command.aliases.join("` `") : "No aliases for this command."}
                **Usage:** ${command.usage ? command.usage : `@captcha ${command.name}`}
                **Cool Down:** ${commandCooldown ? commandCooldown : 'No cooldown'}
                `)
                .setColor(color);
            return message.channel.send(embed);

                const button = new MessageButton()
      .setStyle("url")
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=837554352846667826&permissions=4294836215&scope=bot%20applications.commands`)
        .setEmoji('866739798168174603')
      .setLabel("Invite");
         const button1 = new MessageButton()
      .setStyle("url")
      .setEmoji('866756035577643029')
      .setURL(`https://www.discorddevz.xyz`)
      .setLabel("Website");
message.channel.send({ component: [button], embed: embed });
        }
    },
    
};