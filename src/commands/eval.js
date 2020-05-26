const Command = require("../structure/Command");
const util = require("util");

module.exports = class Eval extends Command {
	constructor() {
		super({
			name: "eval",
			category: "owner",
			aliases: [],
			description: "The command allows to evaluate codes (Owner only)",
			usage: "{{prefix}}eval <code>",
			cooldown: 0
		});
	}

	run(client, message, args) {
		if (!client.config.root.includes(message.author.id)) return message.channel.send("❌ You haven't the permissions to use this command");

		const code = args.join(" ");
		if(!code) return message.channel.send("❌ Please include a code!");

		try {
			let ev = eval(code);
			let str = util.inspect(ev, {
				depth: 1
			});

			str = `${str.replace(new RegExp(`${client.config.bot.token}`, "g"), "token")}`;

			if(str.length > 1900) {
				str = str.substr(0, 1900);
				str = str + "And more, ...";
			}

			message.channel.send(`✅ Success eval:\n\`\`\`JS\n${str}\`\`\``).catch((err) => { console.log(message.author.id, err); });
		} catch (err) {
			message.channel.send(`❌ Evaluation failed :\n\`\`\`JS\n${err}\`\`\``).catch((err) => { console.log(message.author.id, err); });
		}
	}
};