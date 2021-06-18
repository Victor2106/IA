**FR**

# **_IA_**

IA est un bot Musique utilisant discord.js 12 ainsi que Lavalink pour atteindre une bonne 
qualité !

```
Utilisation
```

* Téléchargez jdk (java) 13 | [Téléchargez sur Linux](https://computingforgeeks.com/install-oracle-java-13-on-ubuntu-debian/) | [Téléchargez sur Windows](https://www.oracle.com/java/technologies/javase-jdk13-downloads.html)
* Téléchargez la dernière version de [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1) en jar et placez le fichier dans le dossier `utils/Lavalink`
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

**EN**

IA is a bot music using discord.js 12 as well as Lavalink to reach a good
!

```
Use
```

* Download JDK (Java) 13 | [Download on Linux](https://comptingforgeeks.com/install-oracle-java-13-on-ubuntu-debian/) | [Download on Windows](https://www.oracle.com/java/technologies/javase-jdk13-downloads.html)
* Download the latest version of [Lavalink](https://ci.fredboat.com/viewlog.html?buildid=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1) in JAR and place the file in the `ingly / lavalink` folder
* Create a dataset folder at the root, then a file `guilds` and` users` in this one

**Windows**
* Open a terminal and make `cd [Redirection of the Lavalink folder] `and then enter
* If Java is not recognized, follow this [tutorial](https://www.it-swarm.dev/en/java/java-nest-pas-reconnu-comme-une-commende-Interne-ou-externe/1072478327/) and just change the version by yours (13)
* Type Java -Jar Lavalink.jar`
* Then start the bot `Node IA --Shard`

**Linux**
* Make CD [Redirection of the Lavalink folder] `and then enter
* If you are using PM2: `PM2 Start Java --Name =" Lavalink "- -Jar Lavalink.jar`
* Then start the bot `pm2 start ia.js - --shard`
