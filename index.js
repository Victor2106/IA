"use strict";

const { Client, Collection } = require("discord.js"),
    { Manager } = require("@lavacord/discord.js"),
    Enmap = require("enmap"),
    { readdirSync } = require("fs"),
    { join } = require("path"),
    CooldownManager = require("./src/structure/Cooldown");

class Ia extends Client {
    constructor() {
        super({
            messageCacheMaxSize: 10,
            disableEveryone: true
        });
        this.config = require("./config");
        this.commands = new Collection();
        this.radio = new Map();
        this.guildsEntry = new Enmap({ name : "guilds", dataDir: "./data/guilds"});
        this.usersEntry = new Enmap({ name : "users", dataDir: "./data/users"});
        this.cooldown = new CooldownManager(this);
        this.extends = {
            user: require("./utils/models/user"),
            guild: require("./utils/models/guild")
        };
        setTimeout(() => {
            this.manager = new Manager(this, this.config.LAVALINK.NODES, {
                user: this.config.bot.id,
                shards: this.shard.count ? this.shard.count : 1
            });

            this.manager.connect().then(console.log(["Lavalink"], "Connected to Lavalink"))
        }, 60000);

        this.launch();
    }

    launch() {
        this.eventsLoad();
        this.commandsLoad();
        this.login(this.config.bot.token).then(() => console.log(["Base-WS"], "Connected to discord")).catch((e) => {
            console.error(["Base-WS"], `Connection error: ${e}`);
            return process.exit(1);
        });
    }

    eventsLoad() {
        const events = readdirSync(join(__dirname, "src/events")).filter(f => f.endsWith(".js"));
        if (events.length === 0) return console.log(["Problem"], "No event found !");
        let count = 0;

        for (const element of events) {
            try {
                const eventName = element.split(".")[0];
                const filter = require(join(__dirname, "src/events", element));
                this.on(eventName, filter.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "src/events", element))];
                count++;
            } catch (err) {
                console.log(["Error"], `An error has occurred:\n\n${err.message}`);
            }
        }
        console.log(["Events"], `Loaded ${count}/${events.length} events`);
    }

    commandsLoad() {
        let count = 0;
        const commands = readdirSync(join(__dirname, "src/commands")).filter(f => f.endsWith(".js"));
        if (commands.length === 0) return console.log(["Problem"], "No command found !");

        for (const element of commands) {
            try {
                const filter = new (require(join(__dirname, "src/commands", element)))();
                this.commands.set(filter.name, filter);
                count++;
            } catch (err) {
                console.log(["Error"], `An error has occurred with:\n\n${element}: ${err.message}`);
            }
        }
        console.log(["Commands"], `Loaded ${this.commands.size}/${count} commands`);
    }
}

module.exports.client = new Ia();
