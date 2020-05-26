"use strict";

module.exports = class CooldownManager {
	constructor(client) {
		this.cooldown = new Map();
		this.client = client;
	}

	add(id, command, wait) {
		if (!this.cooldown.has(id)) this.cooldown.set(id, []);

		if (this.get(id, command)) {
			this.cooldown.size >= (this.client.options.messageCacheMaxSize / 2) ? this.cooldown.clear() : this.clear(id, command);
			const member = this.cooldown.get(id);
			member.push({ name: command, timestamp: Date.now() + wait });
		}
	}

	get(id, command) {
		if (this.cooldown.has(id)) {
			const hasCooldown = this.cooldown.get(id).find(c => c.name === command);
			if (hasCooldown !== undefined) {
				if (hasCooldown && hasCooldown.timestamp >= Date.now()) {
					this.clear(id, command);
					return { status: false, message: Number(hasCooldown.timestamp - Date.now()) };
				} else {
					this.clear(id, command);
				}
			}
		}
		return { status: true, message: null };
	}

	clear(id) {
		if (this.cooldown.has(id)) {
			if (this.cooldown.get(id).length > 0) {
				this.cooldown.set(id, this.cooldown.get(id).filter(c => c.timestamp > Date.now()));
			}
		}
	}
};