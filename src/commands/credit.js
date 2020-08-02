const Command = require("../structure/Command");

module.exports = class Credit extends Command {
	constructor() {
		super({
			name: "credit",
			category: "bot",
			aliases: ["credits"],
			description: "The command displays the bot's contributors",
			usage: "{{prefix}}credit",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		message.channel.send({
			embed : {
				author : {
					name : "IA",
					icon_url : client.user.avatarURL()
				},
				color : 0x926ce8,
				fields : [{
					name : "\\✨ **Contributors**",
					value : "`Ota`, `PsyKo`, `ImFireGod`",
					inline : true
				}],
				thumbnail : {
					url : client.user.displayAvatarURL()
				},
				footer : {
					text : "Avatar created by VI-JEy | Thanks for using IA !"
				}
			}
		});
	}
};