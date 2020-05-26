const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Queue extends Command {
	constructor() {
		super({
			name: "queue",
			category: "music",
			aliases: [],
			description: "The command displays the music queue",
			usage: "{{prefix}}queue",
			cooldown: 0
		});
	}

	async run(client, message, _args) {
		if (!client.manager.players.get(message.guild.id)) return message.channel.send("❌ I'm not connected in a voice channel!");
             
		if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ The radio is currently playing, the music queue is disabled!");

		let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ I don't have the EMBED_LINKS permission in this channel!");

		if(queue.length > 10) {
			if (!message.channel.permissionsFor(client.user.id).has("ADD_REACTIONS") || !message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES"))
				return message.channel.send("⚠ I don't have the `ADD_REACTIONS` or `MANAGE_MESSAGES` permission in this channel!");

			let pages = Math.round(queue.length / 10 + 0.49);
			let page = 1;
			let p0 = 0;
			let p1 = 10;

			message.channel.send({
				embed: {
					title: "Queue",
					color: client.config.opts.color,
					description: queue.map((song, i) => `**[${(i + 1)}]** => Title [${song.info.title}](${song.info.url})\nAdded by \`${song.author}\``).slice(0, 10).join('\n\n'),
					footer: {
						text: `Page ${page} of ${pages}`
					}
				}
			}).then(msg => {
				msg.react("⬅").then(() => {
					msg.react("➡");

					const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
					const forwardsFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

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
								title: "Queue",
								color: client.config.opts.color,
								description: queue.map((song, i) => `**[${(i + 1)}]** => Title [${song.info.title}](${song.info.url})\nAdded by \`${song.author}\``).slice(p0, p1).join("\n\n"),
								footer: {
									text: `Page ${page} of ${pages}`
								}
							}
						});
					});

					forwards.on("collect", async (reaction) => {
						if(page === pages) return await reaction.users.remove(message.author.id);;
						await reaction.users.remove(message.author.id);

						page++;
						p0 = p0 + 10;
						p1 = p1 + 10;

						msg.edit({
							embed: {
								title: "Queue",
								color: client.config.opts.color,
								description: queue.map((song, i) => `**[${(i + 1)}]** => Title [${song.info.title}](${song.info.url})\nAdded by \`${song.author}\``).slice(p0, p1).join("\n\n"),
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
					title: "Queue",
					color: client.config.opts.color,
					description: queue.map((song, i) => `**[${(i + 1)}]** => Title [${song.info.title}](${song.info.url})\nAdded by \`${song.author}\``).slice(0, 10).join("\n\n"),
				}
			});
		}
	}
};