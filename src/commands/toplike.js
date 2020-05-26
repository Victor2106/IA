const Command = require("../structure/Command");

module.exports = class Toplike extends Command {
	constructor() {
		super({
			name: "toplike",
			category: "music",
			aliases: ["toplikes", "likelist"],
			description: "The command displays the list of your favorite musics",
			usage: "{{prefix}}toplike",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		if (!client.usersEntry.has(message.author.id)) {
			client.usersEntry.set(message.author.id, client.extends.user.userPost(message.author.id));
			console.log(`[userEntry] Create configurations for ${message.author.tag}`);
		}

		const data = client.usersEntry.get(message.author.id);

		if(data.like.length > 10) {
			if(!message.channel.permissionsFor(client.user.id).has("ADD_REACTIONS") || !message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES"))
				return message.channel.send("⚠ I don't have the `ADD_REACTIONS` or `MANAGE_MESSAGES` permission in this channel !").catch(console.error);
		}

		if (data.like.length === 0) {
			message.channel.send("You didn't like any music !");
		} else {
			if(data.like.length > 10) {
				let pages = Math.round(data.like.length / 10 + 0.49);
				let page = 1;
				let p0 = 0;
				let p1 = 10;

				message.channel.send({
					embed: {
						title: "Like list",
						color: client.config.opts.color,
						description: data.like.map((i) => `- **${i}**`).slice(0, 10).join('\n'),
						thumbnail: {
							url: message.author.displayAvatarURL()
						},
						footer: {
							text: `Page ${page} of ${pages}`
						}
					}
				}).then(msg => {
					msg.react("⬅").then(() => {
						msg.react("➡");

						const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
						const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;

						const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
						const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

						backwards.on("collect", async (reaction) => {
							if(page === 1) return await reaction.users.remove(message.author.id);
							await reaction.users.remove(message.author.id);

							page--;
							p0 = p0 - 10;
							p1 = p1 - 10;

							msg.edit({
								embed: {
									title: "Like list",
									color: client.config.opts.color,
									description: data.like.map((i) => `- **${i}**`).slice(p0, p1).join("\n"),
									thumbnail: {
										url: message.author.displayAvatarURL()
									},
									footer: {
										text: `Page ${page} of ${pages}`
									}
								}
							});
						});

						forwards.on("collect", async (reaction) => {
							if(page === pages) return await reaction.users.remove(message.author.id);
							await reaction.users.remove(message.author.id);

							page++;
							p0 = p0 + 10;
							p1 = p1 + 10;

							msg.edit({
								embed: {
									title: "Like list",
									color: client.config.opts.color,
									description: data.like.map((i) => `- **${i}**`).slice(p0, p1).join("\n"),
									thumbnail: {
										url: message.author.displayAvatarURL()
									},
									footer: {
										text: `Page ${page} of ${pages}`
									}
								}
							});
						});
					});
				});
			} else {
				message.channel.send({
					embed: {
						title: "Like list",
						color: client.config.opts.color,
						thumbnail: {
							url: message.author.displayAvatarURL()
						},
						description: data.like.map((i) => `- **${i}**`).slice(0, 10).join("\n"),
					}
				});
			}
		}
	}
};