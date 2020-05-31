const Command = require("../structure/Command");

module.exports = class Moveto extends Command {
	constructor() {
		super({
			name: "moveto",
			category: "music",
			aliases: ["switch"],
			description: "The command allows you to change the voice channel of the bot",
			usage: "{{prefix}}moveto <ChannelName>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if(!message.channel.permissionsFor(message.author.id).has("MOVE_MEMBERS")) return message.channel.send("❌ You haven't the permissions to use this command!");

		if (!message.member.voice.channel) return message.channel.send("⚠ You must be connected in a voice channel !");
		if (!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ I don't have the `join permission` or `speak permission` in this channel!");

		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.channel.send("⚠ I'm not connected in a voice channel!");
		if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ You're not in the same channel as the bot!");

		const query = args.join(' ');
		let channel;

		if (!query) return message.channel.send("⚠ You must specify the name of a channel!");
		else channel = message.guild.channels.cache.filter((c) => c.type === "voice").find((c) => c.name.toLowerCase() === query.toLowerCase() || c.name.toLowerCase().includes(query.toLowerCase()) || c.id === query);
		if (!channel) return message.channel.send("❌ No channel found!");

		try {
			player.switchChannel(channel.id);
			return message.channel.send("☑ The bot is now connected in " + channel.toString() + " voice channel");
		} catch (exception) {
			console.error(exception);
			return message.channel.send("❌ An error has occurred!");
		}
	}
};