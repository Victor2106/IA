const Command = require("../structure/Command");
const { boostBass } = require("../utils/playerManager");

module.exports = class Boostbass extends Command {
	constructor() {
		super({
			name: "boostbass",
			category: "music",
			aliases: ["bassboost"],
			description: "The command adds a bass effect to your music",
			usage: "{{prefix}}boostbass <LOW, MEDIUM, or HIGH>",
			cooldown: 15000
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");
		
		const gain = args.join(" ");

		let choices = ["off", "low", "medium", "high"];
		if (!gain || !choices.includes(gain.toLowerCase())) return message.channel.send("⚠ Please include a frequency: LOW, MEDIUM, or HIGH.\n\nPlease select OFF to disable the effect.");

		try {
			boostBass(client, message, gain);
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};