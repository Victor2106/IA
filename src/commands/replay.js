const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Replay extends Command {
	constructor() {
		super({
			name: "replay",
			category: "music",
			aliases: ["resetnow"],
			description: "The command replays the song",
			usage: "{{prefix}}replay",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		const data = client.radio.get(message.guild.id);
		if (data.status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		if(player.paused) player.pause(false);

		message.channel.send("⏮ I'm going to rehearse your music").then(() => {
			try {
				if (queue[0].loop) player.stop();
				else {
					queue[0].loop = true;
					player.stop();
					setTimeout(() => {
						queue[0].loop = false;
					}, 1000);
				}
			} catch (exception) {
				console.error(exception);
				return message.channel.send("❌ An error has occurred!");
			}
		});
	}
};