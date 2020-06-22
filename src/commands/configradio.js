const Command = require("../structure/Command");
const { getFluxRadio } = require("../utils/functions");

module.exports = class Configradio extends Command {
	constructor() {
		super({
			name: "configradio",
			category: "music",
			aliases: ["confradio", "configsradio"],
			description: "The command allows you to configure the bot to reconnect to a voice channel during a reboot (radio)",
			usage: "{{prefix}}configradio <true (enabled) | false (disabled)> <radio name> <voice channel>",
			cooldown: 10000
		});
	}

	run(client, message, args) {
		if(!message.channel.permissionsFor(message.author.id).has("ADMINISTRATOR")) return message.channel.send("⚠ You don't have the `ADMINISTRATOR` permission!");
		if (!client.guildsEntry.get(message.guild.id)) client.guildsEntry.set(message.guild.id, client.extends.guild.guildPost(message.guild.id));

		if (!args.join(" ")) return message.channel.send("⚠ Please specify an argument !\n__Example:__ `" + client.config.bot.prefix + "configradio true nrj musique`");
		if (!args[0]) return message.channel.send("⚠ Please specify true or false to enable or disable reconnection of the radio system!");
		if (args[0].toLowerCase() === "true") {
			if (!args[1]) return message.channel.send("⚠ Please specify a radio name!");
			if (!args[2]) return message.channel.send("⚠ Please specify a channel name!");

			const radio = getFluxRadio(args[1]);
			if (radio === undefined || radio === null) return message.channel.send("__Please indicate an existing radio station:__ \n\nFrench station's :\n`nrj`, `virginradio`, `skyrock`, `rtl`, `bfm`, `funradio`, `rfm`, `franceinter`, `francemusique`, `franceculture`, `rtl2`, `europe1`, `radiocontact`, `contactfm` !\n\nEnglish station's :\n`bbc`, `classicfm`, `Others soon`");

			const channel = message.guild.channels.cache.filter((c) => c.type === "voice").find((c) => c.name.toLowerCase() === args[2].toLowerCase() || c.name.toLowerCase().includes(args[2].toLowerCase()) || c.id === args[2]);
			if (!channel) return message.channel.send("❌ No channel found!");

			try {
				const data = client.guildsEntry.get(message.guild.id);

				data.autoconfig.radio = args[0].toLowerCase() === "true";
				data.autoconfig.link = radio;
				data.autoconfig.channel = channel.id;

				client.guildsEntry.set(message.guild.id, data);
				message.channel.send("✅ Your configuration has just been added!");
			} catch (exception) {
				console.error(exception);
				return message.channel.send("❌ An error has occurred!");
			}
		} else {
			const data = client.guildsEntry.get(message.guild.id);

			try {
				data.autoconfig.radio = false;
				data.autoconfig.link = null;
				data.autoconfig.channel = null;

				client.guildsEntry.set(message.guild.id, data);
				message.channel.send("✅ Your configuration has just been added!");
			} catch (exception) {
				console.error(exception);
				return message.channel.send("❌ An error has occurred!");
			}
		}
	}
};