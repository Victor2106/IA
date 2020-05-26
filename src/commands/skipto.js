const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Skipto extends Command {
	constructor() {
		super({
			name: "skipto",
			category: "music",
			aliases: [],
			description: "The command skips a requested number of songs in the queue",
			usage: "{{prefix}}skipto <Number>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		const data = client.radio.get(message.guild.id);
		if (data.status) return message.channel.send("⚠ The radio is currently playing, the music queue is disabled!");

		const choice = args.join(' ');
		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);


		if (!choice || isNaN(choice)) return message.channel.send("⚠ Please indicate the number of the music in the queue");
		else if (choice === "0" || choice === "-0" || choice === "+0" || choice === "+0.0" || choice === "-0.0") return message.channel.send("❌ You can't skip to the currently playing song!");
		else if (choice < 0 || choice > queue.length - 1) return message.channel.send("❌ No music found!");

		if(player.paused) player.pause(false);

		message.channel.send("⏩ Skipping ...").then((m) => {
			m.delete();
			try {
				queue.splice(0, (choice-1));
				return player.stop();
			} catch (exception) {
				console.error(exception);
				return message.channel.send("❌ An error has occurred!");
			}
		});
	}
};