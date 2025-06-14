// ==UserScript==
// @name         DO player_faces
// @version      1.0
// @namespace    jed
// @description  dugout-online player face generation
// @author       Helamam
// @icon         https://i.ibb.co/kDL4QcD/premium1t.png
// @require	     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @include      http*dugout-online.com/*
// @include      https://www.dugout-online.com/*
// @downloadURL  https://raw.githubusercontent.com/jedimv/DO_player_faces/main/DOplayerfaces.user.js
// @updateURL    https://raw.githubusercontent.com/jedimv/DO_player_faces/main/DOplayerfaces.user.js
// ==/UserScript==

var page = document.URL;
var player_id = 0
var club_id = 0
var player_id_length = 0
var player_age = 0
var player_nation
var FP
var LP

var colorImg_value
var faceImg_value
var hairImg_value
var beardImg_value

var is_link_from_nt = false
var nation_badge = ''
var kit_identify = 'none'
var kit_img = ""

var face = {
	category: 0,
	color: 0,
	hair: 0,
}

const nationFaceWeights = {
  'bolivia':     { latin: 90, african: 5, caucasian: 5 },
  'venezuela':   { latin: 80, african: 10, caucasian: 10 },
  'mexico':      { latin: 90, caucasian: 5, african: 5 },
  'brazil':      { latin: 50, african: 25, caucasian: 25 },
  'chile':       { latin: 85, caucasian: 10, african: 5 },
  'uruguay':     { caucasian: 80, latin: 15, african: 5 },
  'colombia':    { latin: 70, african: 20, caucasian: 10 },
  'peru':        { latin: 90, caucasian: 5, african: 5 },

  'china':       { asian: 98, caucasian: 1, african: 1 },
  'skorea':      { asian: 98, caucasian: 1, african: 1 },
  'japan':       { asian: 97, caucasian: 2, african: 1 },
  'bangladesh':  { asian: 95, caucasian: 3, african: 2 },
  'thailand':    { asian: 97, caucasian: 2, african: 1 },

  'india':       { asian: 80, caucasian: 15, african: 5 },

  'algeria':     { arabic: 80, african: 15, caucasian: 5 },
  'safrica':     { african: 70, caucasian: 25, asian: 5 },

  'unitedstates':{ caucasian: 65, african: 20, latin: 15 },
  'australia':   { caucasian: 90, asian: 5, african: 5 },
  'iceland':     { caucasian: 98, african: 1, asian: 1 },
  'canada':      { caucasian: 85, asian: 10, african: 5 },
  'argentina':   { caucasian: 85, latin: 10, african: 5 },
  'belgium':     { caucasian: 75, african: 20, arabic: 5 },
  'bosnia':      { caucasian: 95, arabic: 5 },
  'croatia':     { caucasian: 98, latin: 2 },
  'denmark':     { caucasian: 98, african: 1, asian: 1 },
  'england':     { caucasian: 85, african: 10, asian: 5 },
  'estonia':     { caucasian: 98, asian: 1, african: 1 },
  'finland':     { caucasian: 98, asian: 1, african: 1 },
  'france':      { caucasian: 75, african: 15, arabic: 10 },
  'germany':     { caucasian: 85, arabic: 10, african: 5 },
  'italy':       { caucasian: 90, arabic: 5, african: 5 },
  'latvia':      { caucasian: 98, asian: 1, african: 1 },
  'netherlands': { caucasian: 90, african: 5, asian: 5 },
  'norway':      { caucasian: 97, african: 2, asian: 1 },
  'newzeland':   { caucasian: 90, asian: 7, african: 3 },
  'poland':      { caucasian: 98, african: 1, asian: 1 },
  'portugal':    { caucasian: 85, african: 10, latin: 5 },
  'romenia':     { caucasian: 95, african: 3, asian: 2 },
  'serbia':      { caucasian: 97, african: 2, asian: 1 },
  'slovenia':    { caucasian: 97, african: 2, asian: 1 },
  'spain':       { caucasian: 75, latin: 20, african: 5 },
  'sweden':      { caucasian: 95, african: 3, asian: 2 },
  'turkey':      { arabic: 60, caucasian: 35, african: 5 },
  'scotland':    { caucasian: 97, african: 2, asian: 1 },
  'czechia':     { caucasian: 98, african: 1, asian: 1 },
  'slovakia':    { caucasian: 98, african: 1, asian: 1 },
  'austria':     { caucasian: 97, african: 2, asian: 1 },
  'bulgaria':    { caucasian: 98, african: 1, asian: 1 },
  'hungria':     { caucasian: 97, african: 2, asian: 1 },
  'albania':     { caucasian: 95, arabic: 3, african: 2 },
  'ireland':     { caucasian: 98, african: 1, asian: 1 },
  'lithuania':   { caucasian: 98, african: 1, asian: 1 },
  'russia':      { caucasian: 96, asian: 2, african: 2 },
  'switzerland': { caucasian: 90, african: 5, asian: 5 },
  'montenegro':  { caucasian: 97, african: 2, asian: 1 },
  'greece':      { caucasian: 95, arabic: 3, african: 2 },
  'moldova':     { caucasian: 98, african: 1, asian: 1 },
  'malta':       { caucasian: 97, arabic: 2, african: 1 }
};

const defaultFaceWeights = {
    caucasian: 50,
    african: 15,
    latin: 15,
    asian: 10,
    arabic: 10
};

// tipo de "_ready()" function ?
if (page.match('/home/none/')) {
	console.log("???")
	
}

// quando a página do player for aberta
if (page.match('/players/details/')) {
	get_club_id();
    get_player_id();
	get_player_nation();
	
	verify_club_id();

	set_player_face();
	edit_player_image();
}

function pid_length() {
	player_id_length = player_id.toString().length
}

function get_player_id() {
	var id_text = document.getElementsByClassName("player_id_txt")[0].outerText;
    var id_filter = /\(([^)]+)\)/;
    var id_numb = id_filter.exec(id_text);
    var id_remove_ID = id_numb[1].match(/(\d+)/);

	player_id = id_remove_ID[0]
	player_id = Number(player_id);
	pid_length();

	if (player_id_length == 6) {
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 6 digitos
		FP = parseInt(player_id / 1000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else if (player_id_length == 7) {
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 7 digitos
        FP = parseInt(player_id / 10000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else if (player_id_length == 8) {
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 8 digitos
		FP = parseInt(player_id / 100000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
    else if (player_id_length == 9) {
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 9 digitos
		FP = parseInt(player_id / 1000000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else{
		console.log("debug, < 6 ou > 9")
	}

    console.log(player_id)
	//console.log(player_id_length)
	//console.log(String(FP).padStart(3, '0'))
	//console.log(String(LP).padStart(3, '0'))
}

function generate_face(FP, LP){
	let combination = FP + LP;
	let number = parseInt(combination)

	let color = number % 10;
	let hair = number % 10;
	
	var category = 0
	var ethnicity = get_face_category(FP, LP, player_nation)
	if(ethnicity == 'caucasian'){category = 0}else if(ethnicity == 'latin'){category = 1}else if(ethnicity == 'african'){category = 2}else if(ethnicity == 'asian'){category = 3}else if(ethnicity == 'arabic'){category = 4}

	console.log(ethnicity, category, color, hair);
	return {category, color, hair};
}

function get_face_category(FP, LP, nation){
	nation = nation.toLowerCase();
	const seed = (FP * 1000 + LP + hashString(nation)) % 100; // resultado entre 0 e 99 ?

	const weights = nationFaceWeights[nation] || defaultFaceWeights;

	let cumulative = 0;
	for(let cat in weights){
		cumulative += weights[cat];
		if (seed < cumulative) return cat;
	}

	return "caucasian"; // fallback ?
}

function hashString(str){
	let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // transforma em inteiro de 32 bits
    }
    return Math.abs(hash);
}

function get_club_id() {
	var currentUrl = window.location.href;
	var index = currentUrl.indexOf('club_id/');
	
	if (index !== -1) {
    var startIndex = index + 'club_id/'.length;
    var clubIdValue = currentUrl.slice(startIndex);

    if (!isNaN(clubIdValue)) {
        console.log('Club ID:', clubIdValue);
    } else {
        console.error('Valor após "club_id/" não é um número válido.');
    }
	} else {
    console.error('"club_id/" não encontrado na URL.');
	}

	club_id = clubIdValue;
	club_id = Number(club_id);

}

function get_player_nation(){
	const playerHeaderDiv = document.querySelector('.player_header img');
	var imgSrc
	
	if (playerHeaderDiv) {
		imgSrc = playerHeaderDiv.getAttribute('src');
		console.log(imgSrc);
	}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bol.png') {player_nation = 'bolivia', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ven.png') {player_nation = 'venezuela', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mex.png') {player_nation = 'mexico', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/brz.png') {player_nation = 'brazil', face.category = 1}	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/chi.png') {player_nation = 'chile', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/uru.png') {player_nation = 'uruguay', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/col.png') {player_nation = 'colombia', face.category = 1}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/per.png') {player_nation = 'peru', face.category = 1}

	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/chn.png') {player_nation = 'china', face.category = 3}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sko.png') {player_nation = 'skorea', face.category = 3}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/jpn.png') {player_nation = 'japan', face.category = 3}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ban.png') {player_nation = 'bangladesh', face.category = 3}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/tha.png') {player_nation = 'thailand', face.category = 3}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ind.png') {player_nation = 'india', face.category = 4}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/isr.png') {player_nation = 'israel', face.category = 4}

	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/alg.png') {player_nation = 'algeria', face.category = 2}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/saf.png') {player_nation = 'safrica', face.category = 2}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/usa.png') {player_nation = 'unitedstates', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/aus.png') {player_nation = 'australia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ice.png') {player_nation = 'iceland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/can.png') {player_nation = 'canada', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/arg.png') {player_nation = 'argentina', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bel.png') {player_nation = 'belgium', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bih.png') {player_nation = 'bosnia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/cro.png') {player_nation = 'croatia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/den.png') {player_nation = 'denmark', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/eng.png') {player_nation = 'england', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/est.png') {player_nation = 'estonia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/fin.png') {player_nation = 'finland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/fra.png') {player_nation = 'france', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ger.png') {player_nation = 'germany', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ita.png') {player_nation = 'italy', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/lat.png') {player_nation = 'latvia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/net.png') {player_nation = 'netherlands', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/nor.png') {player_nation = 'norway', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/nze.png') {player_nation = 'newzeland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/pol.png') {player_nation = 'poland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/por.png') {player_nation = 'portugal', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/rom.png') {player_nation = 'romenia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sam.png') {player_nation = 'serbia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/slo.png') {player_nation = 'slovenia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/spa.png') {player_nation = 'spain', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/swe.png') {player_nation = 'sweden', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/tur.png') {player_nation = 'turkey', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sco.png') {player_nation = 'scotland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/cze.png') {player_nation = 'czechia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/svk.png') {player_nation = 'slovakia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/aut.png') {player_nation = 'austria', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bul.png') {player_nation = 'bulgaria', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/hun.png') {player_nation = 'hungria', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/alb.png') {player_nation = 'albania', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ire.png') {player_nation = 'ireland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/lit.png') {player_nation = 'lithuania', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/rus.png') {player_nation = 'russia', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sui.png') {player_nation = 'switzerland', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mtn.png') {player_nation = 'montenegro', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/gre.png') {player_nation = 'greece', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mol.png') {player_nation = 'moldova', face.category = 0}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mal.png') {player_nation = 'malta', face.category = 0}
	
	console.log(player_nation);
}

// verifica se a club id é de um clube ou seleção e seta o 'kit' baseado nisso
function verify_club_id() {
	const nt_ids_by_country = {
		'brazil': [13343, 13344, 13345, 13346], // NT, U21, U19, U17
		'bolivia': [19438, 19439, 20766, 20767],
		'usa': [13428, 15684, 15685, 15686],
		
		'croatia': [13353, 13354, 13355, 13356],
		'slovenia': [13412, 13413, 13414, 13415],
		'belgium': [13334, 13335, 13336, 13337],
		'hungria': [15680, 15681, 15682, 15683],
		'turkey': [13423, 13424, 13425, 13426],
		'denmark': [13357, 13358, 13359, 13360],

		'skorea': [13648, 13649, 13651, 13652],
		'thailand': [23277, 23278, 23279, 23280],
		'china': [13351, 15469, 15862, 13352]
	}
	
	const known_clubs_ids = {
		'big_fish': [114017],
	}
	
	is_link_from_nt = false

	for (const [country, ids] of Object.entries(nt_ids_by_country)){
		if(ids.includes(club_id)){
			is_link_from_nt = true
			kit_identify = country
		}
	}

	for (const [club, ids] of Object.entries(known_clubs_ids)){
		if(ids.includes(club_id)){
			is_link_from_nt = false
			kit_identify = club
		}
	}

	console.log(kit_identify)
	switch(kit_identify){
		case "brazil":
			kit_img = "https://drive.google.com/thumbnail?id=1FnmTRNB9P3DhOyNwzODKMN0KhBP91JAI";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/brz.png';
			break;
		case "bolivia":
			kit_img = "https://drive.google.com/thumbnail?id=1Z5TqxCd23UxuDcKyUhQaneX89Ndxw15S";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/bol.png';
			break;
		case "usa":
			kit_img = "https://drive.google.com/thumbnail?id=1XMqq0E2e6EznwiGY63uIW5-3vrOCrtZr";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/usa.png';
			break;
		case "croatia":
			kit_img = "https://drive.google.com/thumbnail?id=1Cax9zILoQoeXX2NNgKpeaMrDt6cWjXkN";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/cro.png';
			break;
		case "slovenia":
			kit_img = "https://drive.google.com/thumbnail?id=1uHyB2dfnxfVMr0197UOsIUbV8GGgkqsO";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/slo.png';
			break;
		case "belgium":
			kit_img = "https://drive.google.com/thumbnail?id=1IoYvmrhQe_IAuQP0yeH7okE0V53wejkJ";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/bel.png';
			break;
		case "hungria":
			kit_img = "https://drive.google.com/thumbnail?id=11YWdtlQCNA4pfxuuVKkNGEx9uOoTh8wm";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/hun.png';
			break;
		case "turkey":
			kit_img = "https://drive.google.com/thumbnail?id=1Rr3lnbgxtCaAplh2jdxpeExBEuXJpZZo";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/tur.png';
			break;
		case "denmark":
			kit_img = "https://drive.google.com/thumbnail?id=1_1oXnvapcf4o78F6gD4uz_xcjuqdsxOs";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/den.png';
			break;
		case "skorea":
			kit_img = "https://drive.google.com/thumbnail?id=1S5IvLFUUpbTAidHIUVMzkTgRxquxLflS";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/sko.png';
			break;
		case "thailand":
			kit_img = "https://drive.google.com/thumbnail?id=1AQnWl6_e5IDvgjafLI3UqbQCAXQ97IEY";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/tha.png';
			break;
		case "china":
			kit_img = "https://drive.google.com/thumbnail?id=1q7qwxWgIjcWWX0OoYo88WXey5_UgLBq4";
			nation_badge = 'https://www.dugout-online.com/images/flags_round/half/chn.png';
			break;
		case "big_fish":
			kit_img = "https://drive.google.com/thumbnail?id=1uarppRK1Vr_25A1a_iaiD3JwRaAgS4wg"
			break;
		default:
			kit_img = "https://drive.google.com/thumbnail?id=19fQBGv7-vCHXmhAXO7s0fOT7xgNxEVHO";
			break;
	}
	console.log(kit_img)


	// if (nts_ids.includes(club_id)) {
	// 	is_link_from_nt = true
	// }
	// else {
	// 	is_link_from_nt = false
	// 	if(club_ids.includes(club_id)){ // contém um uniforme (que aparece na foto do jogador)
	// 		if(club_id == club_ids[0]){ // se for o big fish
	// 			
	// 		}
	// 	}
	// 	else{
	// 		
	// 	}
	// }

	
}

function get_club_colors(){
	if (is_link_from_nt){
	}
	else{
		
	}
}

function set_player_face() {
	face = generate_face(FP, LP)
	const colorImgUrls = [
	  ["https://drive.google.com/thumbnail?id=1bwTBRVQC6qlWMFgnesJTqlERwnWVh837", "https://drive.google.com/thumbnail?id=1HOjgT4KJLQ7gUfjdYPg5ziSdEJA4WSnN", "https://drive.google.com/thumbnail?id=109z0d6UjMU-0dMmCBlORqQNRupwbnlZR", "https://drive.google.com/thumbnail?id=1PD1YWsj1D6VSXFSmMvh4VCY8J__8eGVm", "https://drive.google.com/thumbnail?id=19y_GbNJrFKEM5aeYjEYp8laZ_eiM-ycr", "https://drive.google.com/thumbnail?id=1_5524qzndJfMF1AnaV6ECPiUg31h41ah", "https://drive.google.com/thumbnail?id=1c4TANYAsYkMvtzF42c21ylFRABZxmO8G", "https://drive.google.com/thumbnail?id=1SDbMF9w_2v0cq2FWDnbdqz4Xe_k5DvN7", "https://drive.google.com/thumbnail?id=1xOi1zuKBliI14mmST0L7OO8geZQLLwa6", "https://drive.google.com/thumbnail?id=1NTLlCv6-r1yGQ-sfyBoGSRGQcZM05D6o",],
	  ["https://drive.google.com/thumbnail?id=1sgkRDYnWVI0cmmWyy7g-Le_Vi3rfpuKm", "https://drive.google.com/thumbnail?id=1x9SLU28TxHSqWjA53_Ne-rXQ2n563itN", "https://drive.google.com/thumbnail?id=17BRInPk-wfg__ms59NBGwOfMnGDcFz4e", "https://drive.google.com/thumbnail?id=1vXQfuvYIaumuXAptabdkbi5ARLKV_Fs0", "https://drive.google.com/thumbnail?id=1sqy-Ll_PjAnZ1cWfIQggth2rVST7HPoM", "https://drive.google.com/thumbnail?id=1sqy-Ll_PjAnZ1cWfIQggth2rVST7HPoM", "https://drive.google.com/thumbnail?id=1aRbD-7pWBDo8VvbUplqfLJRhqK5KEl6Y", "https://drive.google.com/thumbnail?id=1yItVVk8XZfcn_wBRIQs8d_j1riOF_NU1", "https://drive.google.com/thumbnail?id=1RiOn5N94d67DNG4QBmfhhtTOSnD5vnZB", "https://drive.google.com/thumbnail?id=1a3wBeMn1mwFY1kRGm02E3MTx4Bw8E0P9",],
	  ["https://drive.google.com/thumbnail?id=1NbaMcxeLWfp9QaZwMDopAmIUkf8_VtFl", "https://drive.google.com/thumbnail?id=1OaMSJcRznoI7WjUT8nQvtAzXieiUeCbU", "https://drive.google.com/thumbnail?id=1dtnxKfZADVxxvMwIsm7Yw8gLj1nrv9hU", "https://drive.google.com/thumbnail?id=1jeoiW2NTVY7sTWMktgM5KgHFtwJL_INv", "https://drive.google.com/thumbnail?id=1eFscZ3hzeNBmb2yj8sKTiZOeRm-mNiGE", "https://drive.google.com/thumbnail?id=1bRba9TxTXdrPxjOCm78XsAXU1AWW7VQL", "https://drive.google.com/thumbnail?id=1EXKj3sFs5QSzKnaR9zpqWpoXBgF4iBSZ", "https://drive.google.com/thumbnail?id=1gByb1cVZFY2AGMVaC7iixOVUL-gZMRJL", "https://drive.google.com/thumbnail?id=1coC21IsFJuW-sPEvv2tkNxa1-3C7zjHL", "https://drive.google.com/thumbnail?id=1CNrHMNU7rMpgAp-mHJvTbfXIKdgCZyaX",],
	  ["https://drive.google.com/thumbnail?id=1sgkRDYnWVI0cmmWyy7g-Le_Vi3rfpuKm", "https://drive.google.com/thumbnail?id=1x9SLU28TxHSqWjA53_Ne-rXQ2n563itN", "https://drive.google.com/thumbnail?id=17BRInPk-wfg__ms59NBGwOfMnGDcFz4e", "https://drive.google.com/thumbnail?id=1vXQfuvYIaumuXAptabdkbi5ARLKV_Fs0", "https://drive.google.com/thumbnail?id=1zmHWtHfpqPT9ywjL8iHsy9KXOU_QCMuD", "https://drive.google.com/thumbnail?id=1zmHWtHfpqPT9ywjL8iHsy9KXOU_QCMuD", "https://drive.google.com/thumbnail?id=1Ca7297nyN0mvwWJLZB5ZClpJtd__YOhE", "https://drive.google.com/thumbnail?id=1yItVVk8XZfcn_wBRIQs8d_j1riOF_NU1", "https://drive.google.com/thumbnail?id=1RiOn5N94d67DNG4QBmfhhtTOSnD5vnZB", "https://drive.google.com/thumbnail?id=1a3wBeMn1mwFY1kRGm02E3MTx4Bw8E0P9",],
	  ["https://drive.google.com/thumbnail?id=13tBPzDNSVTlIMNr1n0LzWXdwnLLgXCWG", "https://drive.google.com/thumbnail?id=1aqTuTed0psztR4uDelIJrNrMQHTrLD8x", "https://drive.google.com/thumbnail?id=1dYxJvLNUqUDM5KAg4KTl8Hb-SY-bZ1ND", "https://drive.google.com/thumbnail?id=1WfiR5_8XD5kH5mjId7WvPrrtFW76yccs", "https://drive.google.com/thumbnail?id=1bnM72MyAGWmtNLt9lsvN8fgtK4ZNt8cS", "https://drive.google.com/thumbnail?id=14NTCk4f6tMULV15FfYUbuRweezfT6lvE", "https://drive.google.com/thumbnail?id=1lMKYT4TY-lPF44tlzQIAe_sg6dSkNXZK", "https://drive.google.com/thumbnail?id=1zIEgeQxBOSu35L4Pbig4SHbLGvKGpbsp", "https://drive.google.com/thumbnail?id=1EDZ76xwHX0qgIXApaPywCLPnGHm49YGX", "https://drive.google.com/thumbnail?id=1xOHg4Ow7Sp8E2M65_QXH-WkMzYJfhkln",]
	];
	colorImg_value = colorImgUrls[face.category][face.color];	

	const hairImgUrls = [ // by ethinicity, caucasian - latin - african - asian - arabic
		["https://drive.google.com/thumbnail?id=1Osl7N_sbqhQxe0U_QHVNCBHEGuzcRo8f", "https://drive.google.com/thumbnail?id=1HgGOx3PKneG_d3i8WhWGfEuIZ-Xf7AxW", "https://drive.google.com/thumbnail?id=1VXjwNo0UqrVKtfbck2YSrJJhwf_RD9JQ", "https://drive.google.com/thumbnail?id=1ar7CsRlDHkBuhULyJVBLxVYAl8777YsP", "https://drive.google.com/thumbnail?id=1UuP3Icrm5xeiG67JeJouV-CoLn00o5Z2", "https://drive.google.com/thumbnail?id=1PpiZwQbu1BJAVUkvIlAPVVfPZNKRP0fE", "https://drive.google.com/thumbnail?id=1NLYU05GvtaQkhO6d8ye9sAt0IAjlJwNJ", "https://drive.google.com/thumbnail?id=1DHlFkFv_nnXsZOx7j9byPuMy3wzMc2gP", "https://drive.google.com/thumbnail?id=188Soq6dosKqC_LB3tOAlmW11l23sCrfW", "https://drive.google.com/thumbnail?id=1XsppDgRhMQX_d0_d4a6kMBugmjc5ElRn"],
		["https://drive.google.com/thumbnail?id=1Osl7N_sbqhQxe0U_QHVNCBHEGuzcRo8f", "https://drive.google.com/thumbnail?id=1iGZfCiExUS8yvgHdzUoXTob-Nr2woXHT", "https://drive.google.com/thumbnail?id=1eJG4RplqDjaHLi1L_4rqYlNIPz-jzYQN", "https://drive.google.com/thumbnail?id=1YInrKemd2ilqyYoiCsjPt5HriwZlUfqu", "https://drive.google.com/thumbnail?id=1yHRxk9Ftu2JTex02Sb16ECYM4FupCZoi", "https://drive.google.com/thumbnail?id=1lFDorhO0PyOK6SQs_VBze2oiWB8iXim1", "https://drive.google.com/thumbnail?id=1rAJHH1sAUzwOLfDlJL1Vc6maq7x5VBsa", "https://drive.google.com/thumbnail?id=19uF5eefflhbAuC4VU5xu5XqOajUmGjZB", "https://drive.google.com/thumbnail?id=1_38nPpacnDVsCYtKzn-XlDoeCYBjZJPL", "https://drive.google.com/thumbnail?id=146wY_aKkDu1e2-sCQgR0XNzI8qVlhBtP"],
		["https://drive.google.com/thumbnail?id=1Osl7N_sbqhQxe0U_QHVNCBHEGuzcRo8f", "https://drive.google.com/thumbnail?id=1NGM7NMCkHgoMWzlJedqCt91LdBmJHgAy", "https://drive.google.com/thumbnail?id=1yut8RpfSjve01UbjWaCCcGhTZAbBvUVT", "https://drive.google.com/thumbnail?id=15HzgYqWvtI1jjYKl_lZ0Mt85dbEQvV3Z", "https://drive.google.com/thumbnail?id=1kB7ugTsC1MdCpdZq9ZeIrtHFvULAobJP", "https://drive.google.com/thumbnail?id=19AGtjV-rLKLXSR7ZplfkrBhLuMZXlM4f", "https://drive.google.com/thumbnail?id=18ZZD6PnjAdrTmFKTLs8UkLnufkdrZ1J0", "https://drive.google.com/thumbnail?id=1acSfAVGpHHiMNGI_QTvQ3Rl8ZDqsb85V", "https://drive.google.com/thumbnail?id=1nUhcBQPa5Poaek212Ul1VdnZZyefUEhE", "https://drive.google.com/thumbnail?id=1y8Mdq_9ltrbZT0FnP5vuzJVZTBqf3fvO"],
		["https://drive.google.com/thumbnail?id=1Osl7N_sbqhQxe0U_QHVNCBHEGuzcRo8f", "https://drive.google.com/thumbnail?id=1jyuFvG1nEwxJ_rLFrvRxCJPcTdfDfgIb", "https://drive.google.com/thumbnail?id=1t9QzRM_Df8QzxDtAzF9MjXTwOHlyx8zs", "https://drive.google.com/thumbnail?id=1ZNik2aIU7AA7Owor2RQDIr0CICOZLT_V", "https://drive.google.com/thumbnail?id=1wfEK0wndDoHDft5s_4D9eIHXimyLIJIK", "https://drive.google.com/thumbnail?id=1uQGR8u5s5SZRXy212mszzJFsjxq_SYCp", "https://drive.google.com/thumbnail?id=1wfEK0wndDoHDft5s_4D9eIHXimyLIJIK", "https://drive.google.com/thumbnail?id=1mNUnBQhp2tbSVzYCl-h7R7jVWvENPCZm", "https://drive.google.com/thumbnail?id=1l-sOf0NIAg_7AaE4raM_fZc_9HfTmtD_", "https://drive.google.com/thumbnail?id=1JLqOBpuGzPhyVvXd5yA0sq47U3cZgM6J"],
		["https://drive.google.com/thumbnail?id=1Osl7N_sbqhQxe0U_QHVNCBHEGuzcRo8f", "https://drive.google.com/thumbnail?id=1QNnwyNOz-Onj7UFtdU4hjHk4dno31Upu", "https://drive.google.com/thumbnail?id=13WU4TVFh0vcKOO7Ek_7cEizzXL3Dw22A", "https://drive.google.com/thumbnail?id=1x2jRfT2R2OPsr2UoWGIZNrLc9KzRapDl", "https://drive.google.com/thumbnail?id=1GroMKUzJ13bcGOFKAzx6alXRXFtkoBCU", "https://drive.google.com/thumbnail?id=1E3sjLjKs7FieMmt0Y2o7qAwZHJPyg8Xx", "https://drive.google.com/thumbnail?id=1TTSs5-Rt9rP6pjJkoiGXlZOn41QXM8YU", "https://drive.google.com/thumbnail?id=1GQHDcxDpB_4PV3yT5GrMbQdDKGZqWYC2", "https://drive.google.com/thumbnail?id=1k_g_H_tt6kk6gRua4m3c7_rkrWquO7LI", "https://drive.google.com/thumbnail?id=1_CBuLjEgMRGtUAxW49UbxMKCjCuC44Fp"]
	]
	hairImg_value = hairImgUrls[face.category][face.hair];

	const beardImgUrls = [];
}

function edit_player_image(){
	var playerImg = document.querySelector("img[src='https://www.dugout-online.com/images/club/profile/player-pic-default.png']");

	// badge img
	var badge = document.createElement("img");
	if(is_link_from_nt == true){
		badge.src = nation_badge;
	}
	else{
		badge.src = "https://www.dugout-online.com/inc/show_custom_badge.php?id="+club_id; 
	}
	
	badge.style.position = "absolute";
	badge.style.top = "0";
	badge.style.left = "0";
	badge.style.transform = 'translate(100px, 140px)';
	badge.width = "30";
	badge.height = "30";	

	// hair img
	var hairImg = document.createElement("img");
	hairImg.src = hairImg_value; 
	hairImg.style.position = "absolute";
	hairImg.style.top = "0";
	hairImg.style.left = "0";
	hairImg.style.transform = 'translate(0px, -1px)';

	// face img
	var colorImg = document.createElement("img");
	colorImg.src = colorImg_value; 
	colorImg.style.position = "absolute";
	colorImg.style.top = "0";
	colorImg.style.left = "0";
	colorImg.style.transform = 'translate(0px, -2px)';

	// shirt img
	var shirtImg = document.createElement("img");
	shirtImg.src = kit_img; 
	shirtImg.style.position = "absolute";
	shirtImg.style.top = "0";
	shirtImg.style.left = "0";
	
	// border img
	var borderImg = document.createElement("img");
	borderImg.src = "https://i.ibb.co/P5HfC1f/border.png";
	borderImg.style.position = "absolute";
	borderImg.style.top = "0";
	borderImg.style.left = "0";

	// Adicionar a imagem de sobreposição ao mesmo contêiner do jogador
	playerImg.parentNode.appendChild(colorImg);
	playerImg.parentNode.appendChild(hairImg);
	//playerImg.parentNode.appendChild(beardImg);
	playerImg.parentNode.appendChild(shirtImg);
	playerImg.parentNode.appendChild(badge);
	playerImg.parentNode.appendChild(borderImg);

	// bg
	playerImg.src = "https://i.ibb.co/3TyM4gg/bg.png";
}

