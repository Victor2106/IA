const Command = require("../structure/Command");
const { addQueue, getRadio } = require("../utils/playerManager");

module.exports = class Playscnow extends Command {
	constructor() {
		super({
			name: "playscnow",
			category: "music",
			aliases: [],
			description: "The command plays SoundCloud music without displaying the selection",
			usage: "{{prefix}}playscnow <Music Title>",
			cooldown: 10000
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");
		if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel!");

		if (!client.radio.has(message.guild.id)) getRadio(client, message.guild.id, false);

		const data = client.radio.get(message.guild.id);

		if (client.manager.players.get(message.guild.id)) {
			if (data.status) {
				client.manager.players.get(message.guild.id).stop();
				data.status = false;
			}
		}

		const track = args.join(' ');
		if (!track) return message.channel.send("⚠ You must indicate the title of a music!");

		const type = {
			name: "scsearch",
			now: true
		};

		const player = client.manager.players.get(message.guild.id);

		try {
			if (!player) {
				client.manager.join({
					guild: message.guild.id,
					channel: message.member.voice.channelID,
					node: client.manager.idealNodes[0].id
				}, { selfdeaf: true });
			} else if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) {
				if (!message.member.voice.channel.permissionsFor(client.user.id).has("CONNECT") || !message.member.voice.channel.permissionsFor(client.user.id).has("SPEAK"))
					return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel!");

				player.switchChannel(message.member.voice.channelID, { selfdeaf: true });
			}

			addQueue(client, message, track, type);
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};