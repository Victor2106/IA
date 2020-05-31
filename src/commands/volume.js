const Command = require("../structure/Command");

module.exports = class Volume extends Command {
	constructor() {
		super({
			name: "volume",
			category: "music",
			description: "The command adjusts the volume of the song",
			aliases: [],
			usage: "{{prefix}}volume <Number>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		const volume = args.join(' ');
		if (!volume || isNaN(volume)) return message.channel.send("⚠ Please, include a number between 1 and 100 !");
		else if (volume <= 0 || volume > 100) return message.channel.send("⚠ Please, include a number between 1 and 100 !");

		try {
			player.volume(Math.round(volume));
			return message.channel.send(`🔊 The volume is now at \`${Math.round(volume)}/100\``);
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};