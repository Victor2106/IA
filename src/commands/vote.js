const Command = require("../structure/Command");

module.exports = class Vote extends Command {
	constructor() {
		super({
			name: "vote",
			category: "bot",
			description: "The command displays the bot link",
			aliases: ["votes"],
			usage: "{{prefix}}vote",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		message.channel.send("Here is the list of available website:\n\n• **Arcane Center** <https://arcane-center.xyz/bot/568530431763546122>\n• **Top.gg** <https://top.gg/bot/568530431763546122/vote>");
	}
};