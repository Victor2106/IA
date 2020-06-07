const Command = require("../structure/Command");
const Discord = require("discord.js");
const { convertTime } = require("../utils/functions");
const os = require("os");

module.exports = class Info extends Command {
	constructor() {
		super({
			name: "info",
			category: "bot",
			aliases: ["debug", "bot"],
			description: "The command displays information from the bot",
			usage: "{{prefix}}info",
			cooldown: 5000
		});
	}

	run(client, message, _args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");
		
		message.channel.send({
			embed: {
				author: {
					icon_url: client.user.displayAvatarURL(),
					name: "Informations about me"
				},
				color: 0x8186dc,
				fields: [{
					name: "\\⚙️ **__Config__**",
					value: `\`\`\`asciidoc\n= PROCESSOR =\nCPU        :: ${(os.loadavg()[0]*os.cpus().length / 100).toFixed(2)}%\nMemory     :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}MB\nProcessor  :: (${os.arch()}) ${os.cpus()[0].model}\n            \n= INFORMATIONS =    \nNodejs     :: v${process.versions.node}\nDiscord.js :: v${Discord.version}\nUptime     :: ${convertTime(process.uptime())}\`\`\``
				}, {
					name: "\\🎵 Voice channels",
					value: `Connected to **${client.manager.players.size}** channel(s)`,
					inline: true
				}, {
					name: "\\🙍️ Users/Servers count",
					value: `**${client.users.cache.size}** users / **${client.guilds.cache.size}** servers`,
					inline: true
				}],
				thumbnail: {
					url: client.user.displayAvatarURL()
				},
				footer: {
					name: "Developped by Victor#7624"
				}
			}
		});
	}
};