"use strict";

const { getQueue } = require("../utils/playerManager");

module.exports = async (client, oldState, newState) => {
	if ((newState.channelID === null) && oldState.member.user.id === client.user.id) {
		try {
			let queue = getQueue(client.config.LAVALINK.QUEUES, oldState.guild.id);
			if (queue.length > 0) queue.splice(0, queue.length);

			await client.manager.leave(oldState.guild.id);
		} catch (exception) {
			console.log("An error has occurred with voiceStateUpdate !");
		}
	}
};