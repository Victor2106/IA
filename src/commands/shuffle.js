const Command = require("../structure/Command");
const { shuffle, getQueue } = require("../utils/playerManager");

module.exports = class Shuffle extends Command {
	constructor() {
		super({
			name : "shuffle",
			category : "music",
			aliases : [],
			description : "The command mixes the queue",
			usage : "{{prefix}}shuffle",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");
		if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I doesn't have the `join permission` or `speak permission` in this channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length <= 1) return message.channel.send("Several musics are required in the queue!");

		try {
			shuffle(queue);
			message.channel.send("✅ The queue has been shuffled!");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};