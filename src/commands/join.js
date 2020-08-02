const Command = require("../structure/Command");

module.exports = class Join extends Command {
	constructor() {
		super({
			name: "join",
			category: "music",
			aliases: [],
			description: "The command adds the bot to a voice channel",
			usage: "{{prefix}}join",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");
		if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel!");

		const player = client.manager.players.get(message.guild.id);
		if (player) return message.channel.send("⚠ The bot is already connected in a voice channel!");

		try {
			client.manager.join({
				guild: message.guild.id,
				channel: message.member.voice.channelID,
				node: client.manager.idealNodes[0].id
			}, { selfdeaf: true });
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};