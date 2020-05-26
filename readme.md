# **_IA_**

IA est un bot Musique utilisant discord.js 12 ainsi que Lavalink pour atteindre une belle 
qualité !

```
Utilisation
```

* Téléchargez jdk (java) 13
* Téléchargez la dernière version de [Lavalink](https://github.com/Frederikam/Lavalink/releases) en jar et placez le fichier dans le dossier `utils/Lavalink`

**Windows** 
* Ouvrez un terminal et faites `cd [redirection du dossier Lavalink]` puis faites entrer
* Tapez `java -jar Lavalink.jar`
* Ensuite démarrez le bot `node ia --shard` 

**Linux** 
* Faites `cd [redirection du dossier Lavalink]` puis faites entrer
* Si vous utilisez pm2 : `pm2 start java --name="Lavalink" -- -jar Lavalink.jar`
* Ensuite démarrez le bot `pm2 start ia.js -- --shard`