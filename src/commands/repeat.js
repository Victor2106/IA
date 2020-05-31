const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Repeat extends Command {
	constructor() {
		super({
			name: "repeat",
			category: "music",
			aliases: ["loop"],
			description: "The command repeats the music indefinitely",
			usage: "{{prefix}}repeat",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		const data = client.radio.get(message.guild.id);
		if (data.status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		if (!queue[0].loop) {
			queue[0].loop = true;
			return message.channel.send("🔁 The music player will repeat the current music for an undefined time");
		} else {
			queue[0].loop = false;
			return message.channel.send("🔁 The music is now resumed!");
		}
	}
};