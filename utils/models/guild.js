"use strict";

module.exports.guildPost = (req) => {
	return {
		id: req,
		prefix: "i!",
		autoconfig: {
			radio: false,
			link: null,
			channel: null
		}
	}
};