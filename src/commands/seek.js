const Command = require("../structure/Command");
const { convertTime } = require("../utils/functions");

module.exports = class Seek extends Command {
	constructor() {
		super({
			name: "seek",
			category: "music",
			aliases: [],
			description: "The command adjusts the position of a song in the queue",
			usage: "{{prefix}}seek <time>",
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

		if(player.paused) return message.channel.send("⚠ The music turned on pause, the option seek is disabled!");

		const time = client.config.LAVALINK.QUEUES[message.guild.id][0].info.duration;

		const query = args.join(' ');
		if (!query || isNaN(query)) return message.channel.send(`❌ Please, include a number between 1 and ${(time / 1000)}s to edit the position.`);
		else if (query <= 0 || query > (time / 1000)) return message.channel.send(`❌ Please, include a number between 1 and ${(time / 1000)}s to edit the position.`);

		try {
			player.seek((query * 1000));

			return message.channel.send(`⏳ The position is now at \`${convertTime(query)} / ${convertTime((time / 1000))}\``);
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};