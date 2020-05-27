# **_IA_**

IA est un bot Musique utilisant discord.js 12 ainsi que Lavalink pour atteindre une belle 
qualité !

```
Utilisation
```

* Téléchargez jdk (java) 13 | [Téléchargez sur Linux](https://computingforgeeks.com/install-oracle-java-13-on-ubuntu-debian/) | [Téléchargez sur Windows](https://www.oracle.com/java/technologies/javase-jdk13-downloads.html)
* Téléchargez la dernière version de [Lavalink](https://github.com/Frederikam/Lavalink/releases) en jar et placez le fichier dans le dossier `utils/Lavalink`
* Créez un dossier `data` à la racine, puis un dossier `guilds` et `users` dans celui-ci

**Windows** 
* Ouvrez un terminal et faites `cd [redirection du dossier Lavalink]` puis faites entrer
* Si java n'est pas reconnu, suivez ce [tutoriel](https://www.it-swarm.dev/fr/java/java-nest-pas-reconnu-comme-une-commande-interne-ou-externe/1072478327/) et changez juste la version par la votre (13)
* Tapez `java -jar Lavalink.jar`
* Ensuite démarrez le bot `node ia --shard` 

**Linux** 
* Faites `cd [redirection du dossier Lavalink]` puis faites entrer
* Si vous utilisez pm2 : `pm2 start java --name="Lavalink" -- -jar Lavalink.jar`
* Ensuite démarrez le bot `pm2 start ia.js -- --shard`
