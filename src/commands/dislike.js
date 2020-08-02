const Command = require("../structure/Command");
const { getQueue } = require("../utils/playerManager");

module.exports = class Dislike extends Command {
	constructor() {
		super({
			name: "dislike",
			category: "music",
			aliases: ["dislikes"],
			description: "The command allows you to add the music to your list of unloved music",
			usage: "{{prefix}}dislike",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if(!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.playing) return message.channel.send("❌ I'm not connected in a voice channel or I'm not playing!");

		const queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
		if (queue.length === 0) return message.channel.send("❌ The queue is empty!");

		if (!client.usersEntry.has(message.author.id)) {
			client.usersEntry.set(message.author.id, client.extends.user.userPost(message.author.id));
			console.log(`[userEntry] Create configurations for ${message.author.tag}`);
		}

		const data = client.usersEntry.get(message.author.id);

		try {
			if (data.like.includes(queue[0].info.title)) {
				data.like.splice(data.like.indexOf(queue[0].info.title), 1);
				data.dislike.push(queue[0].info.title);
				client.usersEntry.set(message.author.id, data);
				return message.channel.send("⚠ This music is already added to your favorite music. So I replaced your liked music in the unloved music.");
			}

			if (data.dislike.includes(queue[0].info.title)) {
				data.dislike.splice(data.dislike.indexOf(queue[0].info.title), 1);
				client.usersEntry.set(message.author.id, data);
				return message.channel.send("⚠ This music is already in your unloved music list. So I removed your music from this list.");
			}

			data.dislike.push(queue[0].info.title);
			client.usersEntry.set(message.author.id, data);

			message.channel.send("👎🏻 Your dislike is successfully added!");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};