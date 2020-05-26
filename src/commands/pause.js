const Command = require("../structure/Command");

module.exports = class Pause extends Command {
	constructor() {
		super({
			name : "pause",
			category : "music",
			aliases : [],
			description : "The command pauses the music",
			usage : "{{prefix}}pause",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if (!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music queue actions are disabled!");

		if (player.pause === true) return message.channel.send("⚠ The music is already paused!");

		try {
			player.pause(true);
			return message.channel.send("⏸ The music is now paused!");
		} catch(exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};