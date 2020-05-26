const Command = require("../structure/Command");
const { getYouTubeResults } = require("../../utils/ytdl-Ota");

module.exports = class Youtubesearch extends Command {
	constructor() {
		super({
			name: "youtubesearch",
			category: "music",
			aliases: ["ytsearch", "searchyoutube"],
			description: "The command displays information about a YouTube video",
			usage: "{{prefix}}youtubesearch <Music title>",
			cooldown: 0
		});
	}

	async run(client, message, args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		const track = args.slice(0).join(" ");
		if(!track) return message.channel.send("⚠ You must indicate the title of a music!");

		try {
			await getYouTubeResults(track).then((item) => {
				if (item.results[0] === undefined || item.results[0] === null) return message.channel.send("❌ No music found!");
				const data = item.results[0];

				message.channel.send({
					embed: {
						color: 0x454ab2,
						author: {
							name: `${data.video.title} by ${data.uploader.username}`,
							icon_url: "https://cdn.discordapp.com/attachments/579378656061685772/608736851804553239/icon-youtube-10.png",
							url: data.video.url
						},
						thumbnail: {
							url: data.video.thumbnail_src
						},
						description: `**Song snippet** ${data.video.snippet.length > 50 ? data.video.snippet.substr(0, 50) + "..." : data.video.snippet}`,
						fields: [{
							name: `🎵 **__${data.video.title.replace(/([_*`~])/g, "")}__** \`${data.video.duration}\``,
							value: `• **Views** #${data.video.views.replace("vues", "")}\n• **Uploader** ${data.uploader.username}\n• **Verified** ${data.uploader.verified}`
						}],
					}
				});
			});
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};