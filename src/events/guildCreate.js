"use strict";

module.exports = function (client, guild) {
	if (!client.guildsEntry.has(guild.id)) {
		client.guildsEntry.set(guild.id, client.extends.guild.guildPost(guild.id));
		console.log(`[guildEntry] Create configurations for ${guild.name} (ID: ${guild.id})`);
	}
	
	const channel = client.channels.cache.get("620614361529974809");
	if(!channel) return;

	channel.send({
		embed: {
			color: client.config.opts.color,
			title: `${client.user.username} vient d'être ajouté sur le serveur ${guild.name}`,
			description: `\nOn m'a ajouté sur le serveur \`${guild.name}\`\nL'id du serveur est \`${guild.id}\`\nIl y a \`${guild.memberCount}\` membres !\nLe propriétaire est \`${guild.owner.user.username}\``,
			thumbnail: {
				url: guild.iconURL()
			},
			timestamp: new Date(),
			footer: {
				text: `© ${client.user.username}`,
				icon_url: client.user.displayAvatarURL()
			}
		}
	});
};