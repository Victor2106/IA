"use strict";

module.exports.convertTime = (seconds) => {
	const hours = Math.floor(seconds / 3600);
	let minutes =  Math.floor((seconds - (hours * 3600)) / 60);
	seconds = Math.trunc(seconds - (hours * 3600) - (minutes * 60));
	let time = "";

	if (hours) time = `${hours}:`;

	if (minutes || time) {
		minutes = (minutes < 10 && time) ? `0${minutes}` : minutes;
		time += `${minutes}:`;
	}

	if (!time) time = `${seconds.toFixed(0)}s`;
	else time += (seconds < 10) ? `0${seconds}` : seconds;

	return time;
};

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