const Command = require("../structure/Command");
const { convertTime } = require("../utils/functions");
const axios = require("axios");

module.exports = class Deezersearch extends Command {
	constructor() {
		super({
			name: "deezersearch",
			category: "music",
			aliases: ["sdeezer", "searchdeezer"],
			description: "The command displays information of a deezer music",
			usage: "{{prefix}}deezersearch <Music title>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		const track = args.slice(0).join(" ");
		if(!track) return message.channel.send("⚠ You must indicate the title of a music!");

		let titre = track
		.toLowerCase()
		.replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
		.split(" ").join("%20");

		try {
			axios.get(`https://api.deezer.com/search?q=${titre}`).then((res) => {
				if(res.data.data[0] === undefined) return message.channel.send("❌ No music found!");
				else if(res.status !== 200) return message.channel.send("❌ An error has occurred!");

				const data = res.data.data[0];

				message.channel.send({
					embed: {
						author: {
							name: `${data.title_short} by ${data.artist.name}`,
							icon_url: data.artist.picture_medium,
							url: data.link
						},
						thumbnail: {
							url: 'https://www.depurexperiences.com/wp-content/uploads/deezer-logo-circle.png'
						},
						description: `**Song preview** [Link](${data.preview})`,
						fields: [{
							name: `🎵 **__${data.title.replace(/([_*`~])/g, "")}__** \`${convertTime(data.duration)}\``,
							value: `• **Song ID** ${data.id}\n• **Rank** #${data.rank}\n• **Explicit lyrics** ${data.explicit_lyrics ? "✅" : "❌"}`
						}],
						color: 0x454ab2
					}
				});
			}).catch((err) => {
				console.log(err);
				return message.channel.send("❌ An error has occurred!");
			});
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};