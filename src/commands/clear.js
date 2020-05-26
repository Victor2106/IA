const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Clear extends Command {
	constructor() {
		super({
			name: "clear",
			category: "music",
			aliases: ["purge"],
			description: "The command deletes the music queue",
			usage: "{{prefix}}clear",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.channel.send("❌ I'm not connected in a voice channel!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music queue actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);

		try {
			if (queue.length === 0) return message.channel.send("⚠ The queue is empty!");
			else if (queue.length !== 1) queue.splice(1, queue.length);

			message.channel.send("✅ The queue has been cleared!");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};