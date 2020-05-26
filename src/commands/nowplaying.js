const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");
const moment = require("moment");

module.exports = class Nowplaying extends Command {
	constructor() {
		super({
			name: "nowplaying",
			category: "music",
			aliases: ["np"],
			description: "The command displays information about the music being played",
			usage: "{{prefix}}nowplaying",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music queue actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		try {
			let duration = moment.duration({ ms: client.config.LAVALINK.QUEUES[message.guild.id][0].info.duration });

			return message.channel.send({
				embed: {
					title: "🎶 Now Playing",
					description: `[${queue[0].info.title}](${queue[0].info.url})`,
					color: 0x3597a2,
					thumbnail: {
						url: client.user.displayAvatarURL()
					},
					fields: [
						{
							name: "\\⌛ Time",
							value: duration.minutes() + ':' + duration.seconds(),
							inline: true
						},
						{
							name: "Creator",
							value: queue[0].info.author,
							inline: true
						},
						{
							name: "Identifier",
							value: queue[0].info.identifier,
							inline: true
						}
					]
				}
			});
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};