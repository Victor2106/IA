const Command = require("../structure/Command");

module.exports = class Resetdislike extends Command {
	constructor() {
		super({
			name: "resetdislike",
			category: "music",
			aliases: ["resetdislikes"],
			description: "The command deletes all unloved musics",
			usage: "{{prefix}}resetdislike",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if (!client.usersEntry.has(message.author.id)) {
			client.usersEntry.set(message.author.id, client.extends.user.userPost(message.author.id));
			console.log(`[userEntry] Create configurations for ${message.author.tag}`);
		}

		const data = client.usersEntry.get(message.author.id);
		if (data.dislike.length === 0) return message.channel.send("You didn't dislike any music");

		data.dislike.splice(data.dislike, data.dislike.length);
		client.usersEntry.set(message.author.id, data);

		message.channel.send("👍🏻 Your dislikes has been cleared!");
	}
};