const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Remove extends Command {
	constructor() {
		super({
			name: "remove",
			category: "music",
			aliases: [],
			description: "The command deletes a music in the queue",
			usage: "{{prefix}}remove <Number of music>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		const data = client.radio.get(message.guild.id);
		if (data.status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		const choice = args.join(' ');

		if (!choice || isNaN(choice)) return message.channel.send("⚠ Please indicate the number of the music in the queue!");
		if (choice === "0" || choice === "-0" || choice === "+0" || choice === "+0.0" || choice === "-0.0") return message.channel.send("❌ You cannot delete the currently playing song!");
		if (choice < 0 || choice > queue.length - 1) return message.channel.send("❌ No music found!");

		try {
			queue.splice((choice - 1), 1);
			message.channel.send("Your music has been removed!");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};