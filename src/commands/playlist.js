const Command = require("../structure/Command");
const { addQueue, getRadio } = require("../utils/playerManager");

module.exports = class Playlist extends Command {
	constructor() {
		super({
			name: "playlist",
			category: "music",
			aliases: [],
			description: "The command allows you to create a custom playlist",
			usage: "{{prefix}}playlist new <name of the playlist>\\ni!playlist add <name of the playlist> <music name>\\ni!playlist remove <name of the playlist> <music name>\\ni!playlist allremove <name of the playlist>\\ni!playlist delete <name of the playlist>\\ni!playlist list\\ni!playlist show <name of the playlist>\\ni!playlist play <name of the playlist>",
			cooldown: 10000
		});
	}

	run(client, message, args) {
		let index;
		if (!client.usersEntry.has(message.author.id)) {
			client.usersEntry.set(message.author.id, client.extends.user.userPost(message.author.id));
			console.log(`[userEntry] Create configurations for ${message.author.tag}`);
		}

		const choices = ["new", "list", "add", "remove", "allremove", "delete", "show", "play"];

		const track = args.join(" ");
		if (!track || !choices.includes(args[0].toLowerCase())) {
			return message.channel.send(`⚠ Please specify an argument !
\n\`\`\`${client.config.bot.prefix}playlist new <playlist name>
${client.config.bot.prefix}playlist add <playlist name> <music name>
${client.config.bot.prefix}playlist remove <playlist name> <music name>
${client.config.bot.prefix}playlist allremove <playlist name>
${client.config.bot.prefix}playlist delete <playlist name>
${client.config.bot.prefix}playlist list
${client.config.bot.prefix}playlist show <playlist name>
${client.config.bot.prefix}playlist play <playlist name>\`\`\``);
		}

		const data = client.usersEntry.get(message.author.id);

		if (track.toLowerCase().startsWith("new")) {
			const title = args[1];
			if (data.playlist.length >= 3) return message.channel.send("⚠ You can't create more than three playlists.");

			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");
			if (args[2]) return message.channel.send("⚠ Your playlists must contain only one word.");

			if (title.length > 30) return message.channel.send("⚠ Please enter max 30 characters");

			let id = Buffer.from(title).toString("base64");
			if (data.playlist.find(i => i.id === id)) return message.channel.send("⚠ The playlist already exists under this name.");

			let tempoConfig = {
				id,
				title,
				tracks : []
			};

			data.playlist.push(tempoConfig);
			client.usersEntry.set(message.author.id, data);

			message.channel.send(`Your playlist \`${title}\` is now created !`);
		} else if (track.toLowerCase().startsWith("list")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			message.channel.send({
				embed : {
					title : "Playlists list",
					color : client.config.opts.color,
					thumbnail : {
						url : message.author.displayAvatarURL
					},
					description : data.playlist.map((_item, i) => `[${(i + 1)}] - ${_item.title}`).join("\n"),
					footer : {
						text : "Playlists of " + message.author.tag
					}
				}
			});
		} else if (track.toLowerCase().startsWith("add")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");

			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist !");

			const song = args.join(" ").split(" ").slice(2).join(" ");
			if (!song) return message.channel.send("⚠ Please indicate a music name.");

			if (playlist.tracks.find((i) => (i ? i.toLowerCase() : null) === song.toLowerCase())) return message.channel.send("⚠ This music is already added !");
			if (playlist.tracks.length >= 25) return message.channel.send("⚠ You can't add more than 25 musics.");

			playlist.tracks.push(song);
			client.usersEntry.set(message.author.id, data);

			message.channel.send("Your music has been added !");

		} else if (track.toLowerCase().startsWith("remove")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");

			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist !");

			const song = args.join(" ").split(" ").slice(2).join(" ");
			if (!song) return message.channel.send("⚠ Please indicate a music name");

			if (!playlist.tracks.find((i) => (i ? i.toLowerCase() : null) === song.toLowerCase())) return message.channel.send("⚠ This music is not added.");

			index = playlist.tracks.indexOf(song);
			if (index === -1) return message.channel.send("❌ This music does not exist in your playlist.");

			playlist.tracks.splice(index, 1);
			client.usersEntry.set(message.author.id, data);

			message.channel.send("✅ The music was successfully deleted!");

		} else if (track.toLowerCase().startsWith("allremove")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");

			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist !");
			if (playlist.tracks.length === 0) return message.channel.send("⚠ You don't have any music in your playlist.");

			playlist.tracks.splice(playlist.tracks, playlist.tracks.length);
			client.usersEntry.set(message.author.id, data);

			message.channel.send("✅ Music has been successfully deleted!");

		} else if (track.toLowerCase().startsWith("delete")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");
			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist!");

			index = data.playlist.findIndex(i => i.id === id);

			data.playlist.splice(index, 1);
			client.usersEntry.set(message.author.id, data);

			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			message.channel.send("✅ Your playlist has been successfully deleted!");

		} else if (track.toLowerCase().startsWith("show")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");
			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist!");
			if (playlist.tracks.length === 0) return message.channel.send("⚠ You have no music in this playlist!");

			if(playlist.tracks.length > 10) {
				if(!message.channel.permissionsFor(client.user.id).has("ADD_REACTIONS") || !message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES"))
					return message.channel.send("⚠ I don't have the ADD_REACTIONS or MANAGE_MESSAGES permission in this channel!");

				let pages = Math.round(playlist.tracks.length / 10 + 0.49);
				let page = 1;
				let p0 = 0;
				let p1 = 10;

				message.channel.send({
					embed: {
						title: "Songs list",
						color: client.config.opts.color,
						description: playlist.tracks.map((_item, i) => `[${(i + 1)}] - ${_item}`).slice(0, 10).join("\n"),
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
									title: "Songs list",
									color: client.config.opts.color,
									description: playlist.tracks.map((_item, i) => `[${(i + 1)}] - ${_item}`).slice(p0, p1).join("\n"),
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
									title: "Songs list",
									color: client.config.opts.color,
									description: playlist.tracks.map((_item, i) => `[${(i + 1)}] - ${_item}`).slice(p0, p1).join("\n"),
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
						title: "Songs list",
						color: client.config.opts.color,
						thumbnail: {
							url: message.author.displayAvatarURL()
						},
						description: playlist.tracks.map((_item, i) => `[${(i + 1)}] - ${_item}`).slice(0, 10).join("\n"),
					}
				});
			}
		} else if (track.toLowerCase().startsWith("play")) {
			if (data.playlist.length === 0) return message.channel.send("⚠ You have no playlist registered.");

			const title = args[1];
			if (!title) return message.channel.send("⚠ Please indicate the playlist name.");

			const id = Buffer.from(title).toString("base64");
			let playlist = data.playlist.find(i => i.id === id);
			if (!playlist) return message.channel.send("⚠ This playlist doesn't exist !");
			if(playlist.tracks.length === 0) return message.channel.send("You have no music in your playlist");

			if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel !");
			if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I don't have the join permission or speak permission in this channel !");

			if (!client.radio.has(message.guild.id)) getRadio(client, message.guild.id, false);
			client.radio.get(message.guild.id);

			if (client.manager.players.get(message.guild.id)) {
				if (data.status) {
					client.manager.players.get(message.guild.id).stop();
					data.status = false;
				}
			}

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
						return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel !");

					player.switchChannel(message.member.voice.channelID, { selfdeaf: true });
				}

				playlist.tracks.map(async (_item) => {
					const type = {
						name: _item.match(/(?:https?:\/\/)?(?:(?:m|www)\.)?youtu(?:be(?:-nocookie)?(?:\.googleapis)?\.(?:fr|com)\S*)?(?:[&?](?:v|list)=|\/(?:v|e(?:mbed)?|u\/1)\/|\.be\/)([\w-]+)/) ? "ytlink" : "ytsearch",
						now: true
					};

					await addQueue(client, message, _item, type);
				});
				message.channel.send("Playing your `" + playlist.title + "` playlist, contains " + playlist.tracks.length + " musics");
			} catch (exception) {
				return message.channel.send("❌ An error has occurred!");
			}
		}
	}
};