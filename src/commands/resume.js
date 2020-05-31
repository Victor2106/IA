const Command = require("../structure/Command");

module.exports = class Resume extends Command {
	constructor() {
		super({
			name: "resume",
			category: "music",
			aliases: [],
			description: "The command resumes the music",
			usage: "{{prefix}}resume",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		if(!player.paused) return message.channel.send("⚠ The music is already resumed!");

		try {
			player.pause(false);
			return message.channel.send("▶ The music was summed up!");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};