const Command = require("../structure/Command");

module.exports = class Resetlike extends Command {
	constructor() {
		super({
			name: "resetlike",
			category: "music",
			aliases: ["resetlikes"],
			description: "The command deletes all the beloved musics",
			usage: "{{prefix}}resetlike",
			cooldown: 0
		});
	}

	run(client, message, _args) {
		if (!client.usersEntry.has(message.author.id)) {
			client.usersEntry.set(message.author.id, client.extends.user.userPost(message.author.id));
			console.log(`[userEntry] Create configurations for ${message.author.tag}`);
		}

		const data = client.usersEntry.get(message.author.id);
		if (data.like.length === 0) return message.channel.send("You didn't like any music");

		data.like.splice(data.like, data.like.length);
		client.usersEntry.set(message.author.id, data);

		message.channel.send("👍🏻 Your likes has been cleared!");
	}
};