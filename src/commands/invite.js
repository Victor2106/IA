const Command = require("../structure/Command");

module.exports = class Invite extends Command {
	constructor() {
		super({
			name: "invite",
			category: "bot",
			aliases: ["invites", "invitation", "invitations"],
			description: "The command displays the invite link",
			usage: "{{prefix}}invite",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		message.channel.send(`**__Here's my invite link__**\n▸ <https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=20196416>`);
	}
};