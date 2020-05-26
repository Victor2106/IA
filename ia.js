"use strict";

const option = process.argv.includes("--shard");

if (option) {
    const { ShardingManager } = require("discord.js");
    const { bot } = require("./config");

    new ShardingManager("./index.js", {
        respawn : true,
        autoSpawn : true,
        token : bot.token,
        totalShards : "auto",
        shardList : "auto"
    }).on("shardCreate", (shard) => {
        console.log(["ShardingManager"], `Shard #${shard.id}`);
    }).spawn("auto").then(() => {
        console.log(["ShardingManager"], "All shards are launched !");
    }).catch(err => {
        console.log(["ShardingManager"], "An error has occurred ! " + err);
        return process.exit(1);
    });
} else {
    require("./index");
}