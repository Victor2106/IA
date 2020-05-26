const Command = require("../structure/Command");

module.exports = class Support extends Command {
	constructor() {
		super({
			name: "support",
			category: "bot",
			aliases: ["invites", "invitation", "invitations"],
			description: "The command displays the support link",
			usage: "{{prefix}}support",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		message.channel.send("**__Here's my support link__**\n▸ https://discord.gg/kWrqhuA");
	}
};