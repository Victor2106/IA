const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");
const moment = require("moment");

module.exports = class Time extends Command {
	constructor() {
		super({
			name: "time",
			category: "music",
			aliases: ["progression"],
			description: "The command shows the progress of the current music duration",
			usage: "{{prefix}}time",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is playing, music actions are disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		try {
			const duration = moment.duration({ ms: client.config.LAVALINK.QUEUES[message.guild.id][0].info.duration });
			const progression = moment.duration({ ms:  client.manager.players.get(message.guild.id).state.position * 1000 });
			let progressBar = ["▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬", "▬"];
			const calcul = Math.round(progressBar.length * ((progression / 1000 / 1000) / (duration / 1000)));
			progressBar[calcul] = "🔘";

			let time = "[`" + (moment(progression / 1000).hours() === 1 ? "0" : moment(progression / 1000).hours()) + ":" + moment(progression / 1000).minutes() + ":" + moment(progression / 1000).seconds() + "`] " + progressBar.join('') +  " [`" + duration.hours() + "h:" + duration.minutes() + "m:" + duration.seconds() + "`]";

			return message.channel.send({
				embed: {
					color: 0xff933f,
					author: {
						icon_url: "https://cdn.discordapp.com/attachments/579378656061685772/608736851804553239/icon-youtube-10.png",
						name: "Information on current music"
					},
					description: `**Playing › **[\`${queue[0].info.title}\`](${queue[0].info.url})`,
					fields: [{
						name: "⌛ Timeline",
						value: time
					}],
					footer: {
						text: "Added by " + queue[0].author
					}
				}
			});

		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};