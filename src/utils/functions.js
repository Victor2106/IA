"use strict";

module.exports.convertTime = (timeInSeconds) => {
	let time = "";
	
	const days = Math.floor(timeInSeconds / 86400);
	const hours = Math.floor((timeInSeconds - (Math.floor(timeInSeconds / 86400) * 86400)) / 3600);
	const min = Math.floor((timeInSeconds - (Math.floor(timeInSeconds / 3600) * 3600)) / 60);
	const seconds = Math.floor(timeInSeconds % 60)
	
	if (days > 0) time += days + ((days > 1) ? " days" : " day");
	if (hours > 0) time += (days > 0) ? ", " + hours + ((hours > 1) ? " hours" :  " hour") : hours + ((hours > 1) ? " hours" :  " hour");
	if (min > 0) time += (hours > 0 || days > 0) ? ", " + min + ((min > 1) ? " minutes" : " minute") : min + ((min > 1) ? " minutes" : " minute");
	if (seconds > 0) time += (hours > 0 || days > 0 || min > 0) ? ", " + seconds + ((seconds > 1) ? " seconds" : " second") : seconds + ((seconds > 1) ? " seconds" : " second");
	
	return time;
}

module.exports.getFluxRadio = (name) => {
	return {
		"bfm": "http://chai5she.cdn.dvmr.fr/bfmbusiness",
		"nrj": "http://185.52.127.132/fr/30001/mp3_128.mp3?origine=fluxradios",
		"funradio": "http://streaming.radio.funradio.fr/fun-1-44-128",
		"rtl": "http://streaming.radio.rtl.fr/rtl-1-44-128",
		"virginradio": "http://ais-live.cloud-services.paris:8000/virgin.mp3",
		"rfm": "https://ais-live.cloud-services.paris:8443/rfm.mp3",
		"skyrock": "http://www.skyrock.fm/stream.php/tunein16_128mp3.mp3",
		"franceinter": "http://direct.franceinter.fr/live/franceinter-midfi.mp3",
		"francemusique": "http://direct.francemusique.fr/live/francemusique-midfi.mp3",
		"franceculture": "http://direct.franceculture.fr/live/franceculture-midfi.mp3",
		"rtl2": "http://streaming.radio.rtl2.fr/rtl2-1-44-128",
		"europe1": "http://ais-live.cloud-services.paris:8000/europe1.mp3",
		"radiocontact": "http://radiocontact.ice.infomaniak.ch/radiocontact-mp3-128.mp3",
		"contactfm": "http://radio-contact.ice.infomaniak.ch/radio-contact-high",
		"bbc": "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
		"classicfm":"http://media-ice.musicradio.com:80/ClassicFMMP3",
		"mouv":"http://direct.mouv.fr/live/mouv-midfi.mp3"
	} [name];
};