const Command = require("../structure/Command");

module.exports = class Donation extends Command {
	constructor() {
		super({
			name: "donation",
			category: "bot",
			aliases: ["don", "dons", "donations"],
			description: "The command displays the donation link to help the development of the bot",
			usage: "{{prefix}}donation",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		message.channel.send("**__Here's the donation link__**\n▸ <https://paypal.me/victordev>");
	}
};