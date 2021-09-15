const Discord = require('discord.js'),
	url = require('url'),
	path = require('path'),
 router = require('express').Router(),
	express = require('express'),
	passport = require('passport'),
	Strategy = require('passport-discord').Strategy,
	session = require('express-session'),
	ejs = require('ejs'),
	fetch = require('node-fetch'),
	config = require('../config'),
	bodyParser = require('body-parser'),
	app = express(),
	db = require('quick.db'),
	MemoryStore = require('memorystore')(session),
	dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`),
	templateDir = path.resolve(`${dataDir}${path.sep}templates`),
	moment = require('moment');
let domain, callbackUrl;

module.exports = function(client) {
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));

	try {
		const domainUrl = new URL(config.website.protocol + config.website.domain);
		domain = {
			host: domainUrl.hostname,
			protocol: domainUrl.protocol
		};
		callbackUrl = `https://discordtownshop.com/callback`;
	} catch (e) {
		console.log(e);
		throw new TypeError(
			'[ERROR]: Invalid domain Specified in the config file.'
		);
	}

router.get('/:id',(req,res)=>{
  if (!req.session.user) return res.redirect("/authorize")
  id = req.params["id"]
  guildobj = manageguild(id)
  res.render("serverpage",{user:req.session.user,count:guildobj.memberCount, pageTitle:"Edit Guild" , name:guildobj.guildname , iconurl:guildobj.iconurl , owner:guildobj.owner, guildid:guildobj.id})
})

	passport.use(
		new Strategy(
			{
				clientID: config.bot.clientID,
				clientSecret: config.bot.clientSecret,
				callbackURL: callbackUrl,
				scope: ['identify', 'guilds', 'guilds.join']
			},
			(accessToken, refreshToken, profile, done) => {
				process.nextTick(() => done(null, profile));
			}
		)
	);

	app.use(
		session({
			store: new MemoryStore({ checkPeriod: 86400000 }),
			secret:
				'J35U5.I3.B411IN.L0L.S0M3.R4ND0M.3TUFF.H3R3.XD.PUT.S0M3.M0R3.5TUFF.H3R3.PL5.L0L.XD.D0NT.W4ST3.Y0UR.T1M3.R34D1NG.TH15',
			resave: false,
			saveUninitialized: false
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true
		})
	);

	app.locals.domain = config.website.domain;

	app.engine('html', ejs.renderFile);
	app.set('view engine', 'html');

	app.use('/', express.static(path.resolve(`${dataDir}${path.sep}assets`)));
	app.use(
		'/dashboard',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
	);
	app.use(
		'/dashboard/:guildID',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
	);
  	app.use(
		'/stats',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
	);
  	app.use(
		'/about',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
    
	);
	app.use(
		'/verify/:guildID/check',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
	);
	app.use(
		'/verify/:guildID',
		express.static(path.resolve(`${dataDir}${path.sep}assets`))
	);
		app.use(
		'/changelog',
		express.static(path.resolve(`${dataDir}${path.sep}changelog`))
	);
	
	


	function render(res, req, template, data = {}) {
		const baseData = {
			bot: client,
			path: req.path,
			user: req.isAuthenticated() ? req.user : null
		};
		res.render(
			path.resolve(`${templateDir}${path.sep}${template}`),
			Object.assign(baseData, data)
		);
	}
	function checkAuth(req, res, next) {
		if (req.isAuthenticated()) return next();
		req.session.backURL = req.url;
		res.redirect('/login');
	}

	app.get(
		'/login',
		(req, res, next) => {
			if (req.session.backURL) {
				req.session.backURL = req.session.backURL;
			} else if (req.headers.referer) {
				const parsed = url.parse(req.headers.referer);
				if (parsed.hostname === app.locals.domain) {
					req.session.backURL = parsed.path;
				}
			} else {
				req.session.backURL = '/';
			}
			next();
		},
		passport.authenticate('discord')
	);

	app.get(
		'/callback',
		passport.authenticate('discord', { failureRedirect: '/' }),
		(req, res) => {
			if (req.session.backURL) {
				const url = req.session.backURL;
				req.session.backURL = null;
				res.redirect(url);
			} else {
				res.redirect('/');
			}
    })




	app.get('/logout', function(req, res) {
		req.session.destroy(() => {
			req.logout();
			res.redirect('/');
		});
	});


app.get('/about', (req, res) => {
		render(res, req, 'about.ejs');
	});

	app.get('/shawn', (req, res) => {
		render(res, req, 'magic.ejs');
	});

	app.get('/commands', (req, res) => {
		render(res, req, 'commands.ejs');
	});

	app.get('/', (req, res) => {
		render(res, req, 'index.ejs');
	});

	app.get('/404', (req, res) => {
		render(res, req, '404.ejs');
	});
	app.get('/stats', (req, res) => {
		render(res, req, 'stats.ejs');
	});
	app.get('/setup-info', (req, res) => {
		render(res, req, 'setup-info.ejs');
	});
	app.get('/info/setup-info', (req, res) => {
		render(res, req, 'setup-info.ejs');
	});
	app.get('/invite', (req, res) => {
		render(res, req, 'invite.ejs');
	});
	app.get('/changelog', (req, res) => {
		render(res, req, 'changelog.ejs');
	});
	app.get('/members', (req, res) => {
		render(res, req, 'members.ejs');
	});
	app.get('/serverpage', (req, res) => {
		render(res, req, 'serverpage.ejs');
	});


	app.get('/dashboard', checkAuth, (req, res) => {
		render(res, req, 'dashboard.ejs', { perms: Discord.Permissions, config });
	});

	app.get('/dashboard/:guildID', checkAuth, async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.redirect('/dashboard');
		let member = guild.members.cache.get(req.user.id);
		if (!member) return res.redirect('/dashboard');
		if (!member.permissions.has('MANAGE_GUILD'))
			return res.redirect('/dashboard');

		render(res, req, 'settings.ejs', { guild, config, db });
	});

	app.get('/verify/:guildID', checkAuth, async (req, res) => {
		const guild = client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.redirect('/404');
		const member = guild.members.cache.get(req.user.id);
		if (!member) return res.redirect('/404');
		render(res, req, 'verify.ejs', { config });
	});

	app.post('/verify/:guildID', checkAuth, async (req, res) => {
		const response = req.body['h-captcha-response'],
			{ URLSearchParams } = require('url'),
			params = new URLSearchParams(),
			guild = client.guilds.cache.get(req.params.guildID),
			member = guild.members.cache.get(req.user.id),
			logs = guild.channels.cache.get(db.get(`logs_${guild.id}`)) || null;
		if (!member) return res.redirect('/404');
		params.append('secret', config.website.captcha.secretkey);
		params.append('response', response);

		let resp = await fetch('https://hcaptcha.com/siteverify', {
			method: 'post',
			body: params
		}).then(res => res.json());

		if (resp.success) {
			let ip = db.all().filter(x => x.data === req.headers['x-forwarded-for']);
			if (ip.length) {
				render(res, req, 'message.ejs', {
					message: `Verification failed, You have been ${
						(db.get(`punishment_${req.params.guildID}`) || 'kick') === 'kick'
							? 'kicked'
							: 'banned'
					} for verifying with a different Discord account!`
				});
				(db.get(`punishment_${req.params.guildID}`) || 'kick') === 'kick'
					? member.kick().catch(err => {})
					: member.ban().catch(err => {});
				let pog =
					(db.get(`punishment_${req.params.guildID}`) || 'kick') === 'kick'
						? 'kicked'
						: 'banned';
				let embed = new Discord.MesssageEmbed()
					.setTitle(`Verification Logs`)
					.setDescription(`Member ${pog}`)
					.setFooter(member.guild.name, member.guild.iconURL())
					.addField(`Member`, `<@${member.user.id}> (${member.user.id})`)
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
					.addField(
						`Account Age`,
						`Created ${moment(member.user.createdAt).fromNow()}`
					)
					.addField('Reason', 'Verified with a different account')
					.setColor(`#00FF00`);
				if (logs) logs.send({ embed: embed });
			} else {
				db.set(
					`ip_${req.params.guildID}_${req.user.id}`,
					req.headers['x-forwarded-for']
				);
			}
			render(res, req, 'message.ejs', {
				message: `You have been successfully verified! You can now gain access in ${
					guild.name
				}!`
			});
			member.roles.add(db.get(`role_${guild.id}`)).catch(err => {});
			db.set(`verified_${guild.id}_${member.user.id}`, true);
		} else {
			render(res, req, 'message.ejs', {
				message: 'Verificaton Failed, Join the Server and try again later'
			});
			member.kick();
		}
	});

	app.post('/api/prefix', (req, res) => {
		let guildID = req.body.guildID;
		let prefix = req.body.prefix;
		if (!prefix)
			return res.json({
				success: false,
				alert: { title: 'Oops!', message: 'No prefix provided', type: 'error' }
			});
		if (prefix.length > 5)
			return res.json({
				success: false,
				alert: {
					title: 'Error!',
					message: 'The prefix can only be up to 5 letters.',
                     footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.',
					type: 'error'
				}
			});
		let guild = client.guilds.cache.get(guildID);
		if (!guild)
			return res.json({
				success: false,
				alert: {
					title: 'Error!',
					message: 'Please refresh the page and try again',
					type: 'error',
           footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.'
				}
			});
		db.set(`prefix_${guild.id}`, prefix);
		return res.json({
			success: true,
			alert: {
				title: 'Success!',
				message: 'The prefix has been updated.',
				type: 'success',
        footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.'
			}
		});
	});

	app.post('/api/save', async (req, res) => {
		const { guildID, LogsC, WarningC, VR, Punishment } = req.body;
		let guild = client.guilds.cache.get(guildID);
		if (!guild)
			return res.json({
				success: false,
				alert: {
					title: 'Error!',
					message: 'Please refresh the page and try again.',
					type: 'error',
                     footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.'
				}
			});
		try {
			if (Number(LogsC)) {
				let channel = guild.channels.cache.get(LogsC);
				db.set(`logs_${guild.id}`, channel.id);
			}
			if (Number(WarningC)) {
				let channel = guild.channels.cache.get(WarningC);
				db.set(`warningchannel_${guild.id}`, channel.id);
			}
			if (Number(VR)) {
				let role = guild.roles.cache.get(VR);
				db.set(`role_${guild.id}`, role.id);
			}
			if (Punishment) {
				let cp = db.get(`punishment_${guild.id}`);
				if (Punishment !== cp) {
					db.set(`punishment_${guild.id}`, Punishment === 'k' ? 'kick' : 'ban');
				}
			}
		} catch (err) {
			return res.json({
				success: false,
				alert: {
					title: 'Error!',
					message: 'An Unknown Error Occured, Try again later',
					type: 'error',
                     footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.'
				}
			});
		}
		return res.json({
			success: true,
			alert: {
				title: 'Success!',
				message: 'The changes have been saved.',
				type: 'success',
                   footer: 'Copyright 2021 &copy discordtownshop.xyz - All right reserved.'
			}
		});
	});

	app.listen(config.website.port, null, null, () =>
		console.log(`[INFO]: The Dashboard is ready on port ${config.website.port}`)
	);
};
