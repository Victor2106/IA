"use strict";

const { addReadyRadio } = require("../utils/playerManager");

module.exports = function (client) {
    client.user.setPresence({
        activity: {
            name: `IA V2 | ${client.config.bot.prefix}help | Thanks for choosing me ! ❤️`
        }
    });

    client.guilds.cache.filter(g => !client.guildsEntry.has(g.id)).forEach((g) => {
        client.guildsEntry.set(g.id, client.extends.guild.guildPost(g.id));
        console.log(`[guildEntry] Create configurations for ${g.name} (ID:${g.id})`);
    });

    setTimeout(() => {
        const data = client.guildsEntry.filter(x => x.autoconfig.radio);
        if (data.size > 0) {
            data.forEach(async res => {
                const channel = client.channels.cache.get(res.autoconfig.channel);
                if (channel && channel.permissionsFor(client.user.id).has("CONNECT") && channel.permissionsFor(client.user.id).has("SPEAK")) {
                    const player = client.manager.players.get(res.id);
                    try {
                        if (!player) {
                            client.manager.join({
                                guild: res.id,
                                channel: channel.id,
                                node: client.manager.idealNodes[0].id
                            }, { selfdeaf: true });

                            await addReadyRadio(client, res.id, res.autoconfig.link);
                        }
                    } catch (exception) {
                        console.error(exception);
                    }
                }
            });
        }
    }, 65000);
};