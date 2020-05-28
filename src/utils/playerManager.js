"use strict";

const { MessageCollector } = require("discord.js");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

module.exports.getSongs = (manager, search) => {
    const params = new URLSearchParams();
    params.append("identifier", search);

    const node = manager.idealNodes[0];

    return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } })
    .then((res) => res.json())
    .then((data) => data.tracks)
    .catch((err) => {
        console.error(err);
        return null;
    });
};

module.exports.getRadio = (client, guildID, status) => {
    const getRadio = client.radio;
    if (getRadio.has(guildID)) return;

    getRadio.set(guildID, { status: status });
};

module.exports.getQueue = (queues, guildID) => {
    if (!queues[guildID]) queues[guildID] = [];
    return queues[guildID];
};

module.exports.play = (client, msg) => {
    try {
        const queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);
        if (queue.length < 1) return client.manager.leave(msg.guild.id);
        
        const player = client.manager.players.get(msg.guild.id);
        if (!player) return msg.channel.send("❌ I'm not connected in a voice channel!");

        const cur = queue[0];
        msg.channel.send(`🎵 Now Playing :\n\`${cur.info.title} - ${cur.info.author}\``);
        player.play(cur.t);
        player.volume(50);
        player.once("error", (error) => {
            if (error.type === "TrackExceptionEvent") {
                player.play(error.track).catch(() => {
                    return msg.channel.send("❌ This music is not available for playback!");
                });
            } else return msg.channel.send("❌ This music is not available for playback!");
        });
        player.once("end", (data) => {
            if ((data.reason === "REPLACED") || (data.reason === "STOPPED" && queue.length === 0)) return;
            if (!cur.loop) queue.shift();
            this.play(client, msg);
        });
    } catch (e) {
        console.log(e);
        msg.channel.send("❌ An error has occurred!");
    }
};

module.exports.pushQueue = async(client, data, msg) => {
    let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

    queue.push({
        t: data.track,
        author: msg.author.tag,
        loop: false,
        info: {
            identifier: data.info.identifier,
            title: data.info.title,
            duration: data.info.length,
            author: data.info.author,
            url: data.info.uri,
            stream: data.info.isStream,
            seekable: data.info.isSeekable
        }
    });
};

module.exports.addLinkQueue = async(client, msg, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

        const currentQueue = queue.length;
        if (currentQueue >= 50) return msg.channel.send("⚠️ Due to the YouTube limitation, you have reached your maximum number of music files in queue ! (Maximum 50 songs in a queue)");

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return msg.channel.send("⚠ No music found!");

        if (songs.length > 25) {
            for (let i = 0; i < 25; i++) {
                await this.pushQueue(client, songs[i], msg);
            }
        } else if (songs > 1) {
            for (const song of songs) {
                await this.pushQueue(client, song, msg);
            }
        } else await this.pushQueue(client, songs[0], msg);

        if (queue.length > songs.length) return msg.channel.send(`☑ ${songs.length > 20 ? "__YouTube Limitation:__ 25" : songs.length} music(s) added to the queue!`);
        else msg.channel.send(`☑ ${songs.length > 20 ? "__YouTube Limitation:__ 25" : songs.length} music(s) added to the queue!`);

        if (currentQueue <= 1) return this.play(client, msg);
    } catch (exception) {
        console.error(exception);
        return msg.channel.send("❌ An error has occurred!");
    }
};

module.exports.addQueue = async(client, msg, track, type) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

        if (type.name === "ytsearch" || type.name === "scsearch") {
            const songs = await this.getSongs(client.manager,  type.name + ":" + track);
            if (!songs) return msg.channel.send("⚠ No music found !");

            if (songs.length > 1 && !type.now) {
                let model;
                let embed = {
                    color: 0xff933f,
                    author: {
                        name: "Please enter the corresponding number (Between 1 and 5)",
                        icon_url: type.name === "ytsearch" ? "https://cdn.discordapp.com/attachments/579378656061685772/608736851804553239/icon-youtube-10.png" : "https://cdn.icon-icons.com/icons2/832/PNG/512/soundcloud_icon-icons.com_66677.png"
                    },
                    description: `${songs.slice(0, 5).map((s, i) => `#${(i + 1)} | [\`${s.info.title}\`](${s.info.uri})`).join("\n")}`,
                    footer: {
                        text: "Type \"cancel\" to cancel"
                    }
                };

                msg.channel.permissionsFor(client.user.id).has("EMBED_LINKS") ? model = msg.channel.send({ embed }) :
                    model = msg.channel.send(`Please enter the corresponding number\n\`\`\`${songs.slice(0, 5).map((s, i) => (i + 1) + ' - ' + s.info.title).join('\n')}\n\`\`\`\n\nType "cancel" to cancel`);

                model.then(async (m) => {
                    const filter = (m) => m.author.id === msg.author.id;
                    const collector = new MessageCollector(msg.channel, filter, {
                        time: 15000
                    });
                    collector.on("collect", async (msgCollected) => {
                        let choice = msgCollected.content.split(" ")[0];
                        if (choice.toLowerCase() === "cancel") {
                            if(queue.length < 1) await client.manager.leave(msg.guild.id);

                            return collector.stop("STOPPED");
                        }

                        let choices = ["1", "2", "3", "4", "5", "cancel"];
                        if (!choices.includes(choice)) return msg.channel.send("❌ This choice is unavailable!");

                        let song = songs[(choice - 1)];
                        if (!song) return msg.channel.send("⚠ No music found !");

                        collector.stop("PLAY");
                        await m.delete();

                        if (queue.length >= 50) return msg.channel.send("⚠️ Due to the YouTube limitation, you have reached your maximum number of music files in queue ! (Maximum 50 songs in a queue)");
                        this.pushQueue(client, song, msg);

                        if (queue.length > 1) return m.channel.send(`\`${song.info.title}\` - Added by ${msg.author.tag} !`);
                        return this.play(client, m);
                    });
                }).catch(() => {
                    msg.channel.send("❌ An error has occurred or no music found!");
                });
            } else {
                const song = songs[0];
                if (!song) return msg.channel.send("⚠ No music found!");

                if (queue.length >= 50) return msg.channel.send("⚠️ Due to the YouTube limitation, you have reached your maximum number of music files in queue ! (Maximum 50 songs in a queue)");
                this.pushQueue(client, song, msg);

                if (queue.length > 1) return msg.channel.send(`\`${song.info.title}\` - Added by ${msg.author.tag} !`);

                return this.play(client, msg);
            }
        }
    } catch (err) {
        console.error(err);
        return msg.channel.send("❌ An error has occurred!");
    }
};

module.exports.addRadio = async(client, msg, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);
        if (queue.length > 0) queue.splice(0, queue.length);

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return msg.channel.send("⚠ No radio found !");

        const player = client.manager.players.get(msg.guild.id);
        await player.play(songs[0].track);
        await player.volume(50);
    } catch (err) {
        return msg.channel.send("❌ An error has occurred!");
    }
};

module.exports.addReadyRadio = async(client, guild, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, guild);
        if (queue.length > 0) queue.splice(0, queue.length);

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return;

        const player = client.manager.players.get(guild);
        await player.play(songs[0].track);
        await player.volume(50);
    } catch (err) {
        return console.error(err);
    }
};

module.exports.shuffle = (queue) => {
    queue.reverse();
    let i = (queue.length - 1);
    while (i) {
        let random = Math.floor(Math.random() * i);
        let y = queue[--i];
        queue[i] = queue[random];
        queue[random] = y;
    }
    return queue;
};

module.exports.boostBass = (client, msg, gain) => {
    const player = client.manager.players.get(msg.guild.id);
    const values = {
        "off": 0,
        "low": 0.3,
        "medium": 0.6,
        "high": 1
    };

    if(!values[gain.toLowerCase()] && values[gain.toLowerCase()] !== 0) return msg.channel.send("Please include a frequency: LOW, MEDIUM, or HIGH.\n\nPlease select OFF to disable the effect!");

    const arr = Array(6).fill().map((_item, i) => ({ band: i, gain: values[gain.toLowerCase()] }));
    player.equalizer(arr);
    msg.channel.send(`Bass boost level has been set to \`${(values[gain.toLowerCase()] * 100)} / 100\`!`);
};