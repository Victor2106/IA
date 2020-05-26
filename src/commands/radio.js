const Command = require("../structure/Command");
const { getRadio, addRadio } = require("../utils/playerManager");
const { getFluxRadio } = require("../utils/functions");

module.exports = class Radio extends Command {
	constructor() {
		super({
			name: "radio",
			category: "music",
			aliases: ["rplay"],
			description: "The command plays the radio",
			usage: "{{prefix}}radio <radioName>",
			cooldown: 5
		});
	}

	run(client, message, args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");
		if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel!");

		if (!client.radio.has(message.guild.id)) getRadio(client, message.guild.id, true);

		const data = client.radio.get(message.guild.id);

		if (client.manager.players.get(message.guild.id)) {
			if (data.status) {
				client.manager.players.get(message.guild.id).stop();
				data.status = false;
			}
		}

		const embed = {
			color: 0x3597a2,
			author: {
				name: "IA's radios",
				icon_url: client.user.displayAvatarURL()
			},
			fields: [{
				name: '<:France:714522839595614218> | **__French stations__**',
				value: '`nrj`, `virginradio`, `skyrock`, `rtl`, `bfm`, `funradio`, `rfm`, `franceinter`, `francemusique`, `rtl2`, `europe1`, `radiocontact`, `contactfm`'
			}, {
				name: '<:England:714522799527428107> | **__English stations__**',
				value: '`bbc`, `classicfm`, `Others soon`'
			}],
			thumbnail: {
				url: client.user.displayAvatarURL()
			}
		};

		let track = args.join(' ').toLowerCase();
		if (!track) return message.channel.send({ embed });

		const flux = getFluxRadio(track);
		if (flux === null || flux === undefined) return message.channel.send({ embed });

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

			message.channel.send(`📻 The current radio is now : \`${track}\`!`);
			track = flux;
			addRadio(client, message, track);

		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};