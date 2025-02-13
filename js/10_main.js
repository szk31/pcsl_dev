"use strict";
// display string, refered in entry[].type
const singer_lookup = [
	,					// 0b 0000 0x 0
	"看谷にぃあ",		//    0001    1
	"胡桃澤もも",		//    0010    2
	"ももにぃあ",		//    0011    3
	"逢魔きらら",		//    0100    4
	"きらにぃあ",		//    0101    5
	"ももきら",			//    0110    6
	"ぷちここ",			//    0111    7
	"つきみゆこ",		//    1000    8
	,
	"ゆこもも",
	,
	"ゆこきら",
	,,,
	"愛白ふりる",		//   10000   10
	,,,,,,,,,,,,,,,
	"小悪熊ちゅい"		//  100000   20
];

// display order of search
const display_order = [
	,		// 0000
	7, 		// 0001
	6,		// 0010
	4,		// 0011
	5,		// 0100
	3,		// 0101
	2,		// 0110
	1,		// 0111
	12,		// 1000
	,
	9,
	,
	8,
	,,,
	11,		//10000
	,,,,,,,,,,,,,,,
	10
];

// display order of rep display
let member_display_order = [
	7,
	6,
	5,
	3,
	4,
	2,
	1
];

// series search
const series_lookup = {
	"マクロス" : "マクロスまくろす",
	"ラブライブ" : "ラブライブらぶらいぶll",
	"アイマス" : "アイマスあいますデレマスでれます",
	"ジブリ" : "ジブリじぶり",
	"物語シリーズ" : "物語シリーズものがたりしりーず",
	"まどマギ" : "まどマギまどまぎ",
	"disney" : "disneyディズニーでぃずにー"
};

// indices lookup
const entry_idx = {
	song_id : 0,
	video : 1,
	note : 2,
	time : 3,
	type : 4
}, song_idx = {
	name : 0,
	artist : 1,
	reading : 2,
	attr : 3,
	release : 4,
	reference : 5
}, video_idx = {
	id : 0,
	date : 1
};

let video, entry;

const version = "1.8.5";
const key_hash = [
	"473c05c1ae8349a187d233a02c514ac73fe08ff4418429806a49f7b2fe4ba0b7a36ba95df1d58b8e84a602258af69194", //thereIsNoPassword
	"3f01e53f1bcee58f6fb472b5d2cf8e00ce673b13599791d8d2d4ddcde3defbbb4e0ab7bc704538080d704d87d79d0410"
];

/* control / memories */

// prevent menu from opening when info or setting is up
let prevent_menu_popup = false;

// current page name
let current_page = "home";

// key inputed check
let key_valid = false;

let deferred_prompt;

/* setting section */
let settings = {
	set_hidden_unlocked: {			// setting: if hidden options are unlocked
		value: false,
		req_LS: true
	},
	set_show_hidden: {				// setting: if hidden options are displayed
		value: false,
		req_LS: true
	},
	use_intent: {					// setting: [mobile] if uses intent:// instead of https:// for URLs
		value: false,
		req_LS: true
	},
	ser_show_private: {				// setting: do display private video
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_showHidden"]
	},
	ser_select_input: {				// setting: highlight input on click
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_selecInput"]
	},
	ser_via_song_name: {			// search: if search is searching song name
		value: true,
		req_LS: false
	},
	ser_sort_by_date: {				// search: if results are sorted by date
		value: true,
		req_LS: false
	},
	ser_sort_asd: {					// serach: if results are sorted ascendingly
		value: true,
		req_LS: false
	},
	ser_rand_show: {				// setting: if random button is shown
		value: false,
		req_LS: true,
		prv_name: ["pcsl_s_showRandom"]
	},
	ser_rand_req_empty: {			// setting: if random is pressable when input is not empty
		value: false,
		req_LS: true,
		prv_name: ["pcsl_s_ignoreRule"]
	},
	pdt_on_change_only: {			// setting: if predict only shows once input changed
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_autoAnyway"]
	},
	pdt_reading: {					// setting: display reading in predict
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_shwReading"]
	},
	pdt_copy_on_select: {			// setting: if song name copied on select\
		value: false,
		req_LS: true
	},
	rep_show_release: {				// setting: display release date in rep
		value: false,
		req_LS: true,
		prv_name: ["pcsl_s_showReleas"]
	},
	rep_long_press_copy: {			// setting: if long press song copies song name
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_LPressCopy"]
	},
	rep_long_press_time: {			// setting: long press react time (ms)
		value: 600,
		req_LS: true,
		prv_name: ["pcsl_s_longP_time"]
	},
	rep_select_input: {				// setting: highlight input on click
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_rep_select"]
	},
	rep_show_group: {
		value: false,
		req_LS: true
	},
	rep_is_union: {
		value: true,
		req_LS: false
	},
	rep_sort_method: {				// rep: sort
		value: "50",
		req_LS: false
	},
	rep_sort_asd: {					// rep: if results are sorted ascendingly
		value: true,
		req_LS: false
	},
	rep_selected_first: {			// rep: if selected songs are moved to top
		value: false,
		req_LS: false
	},
	rep_show_artist: {				// hidden: if rep-share includes artist name
		value: true,
		req_LS: true,
		prv_name: ["pcsl_s_rep_artist"]
	}
};

function update_setting(key) {
	ls(`pcsl_${key}`, settings[key].value);
	return settings[key].value;
}

function toggle_setting(key) {
	settings[key].value ^= 1;
	return update_setting(key);
}

// ram for searching (entry_processed)
let entry_proc = [];

// memcount - rep generate interval flag
let memcount_rep_int;

// pre-process song names
let processed_song_name = [""];

// pre-process song to be skipped
let auto_skips = [];

{	// theme
	let theme = ls("theme");
	if (!theme) {
		theme = "mixed";
		ls("theme", theme);
	}
	document.documentElement.setAttribute("theme", theme);
}

document.addEventListener('DOMContentLoaded', async function() {
	if (window.innerHeight / window.innerWidth < 1.61) {
		// bad screen ratio, open new window
		$("#v_screen").addClass("post_switch");
		$("#v_screen").height("100%");
		$("#v_screen").width(0.5625 * window.innerHeight);
		$("#v_screen").attr("src", "index.html" + window.location.search);
		// hide original page
		$("body > div").addClass("post_switch");
		$("body").addClass("post_switch");
		// remove key
		let url_para = new URLSearchParams(window.location.search);
		url_para.delete("key");
		window.history.pushState(null, null, `${document.location.href.split('?')[0]}${url_para.size ? `?${url_para}` : ""}`);
		// delete data
		song = song_lookup = note_index = null;
		return;
	}

	let key;
	function decrypt(input) {
		return content_level ? CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8) : input;
	}
	// check url para first
	let url_para = new URLSearchParams(window.location.search);
	key = url_para.get("key");
	let load_from_storage = true;
	let content_level = 0;
	// level 2 storage
	if (await getSHA384Hash(ls("pcsl_key")) === key_hash[1]) {
		content_level = 2;
		key = ls("pcsl_key");
	}
	// level 2 url para
	else if (key !== "" && await getSHA384Hash(key) === key_hash[1]) {
		content_level = 2;
		load_from_storage = false;
		ls("pcsl_key", key);
	}
	// level 1 storage
	else if (await getSHA384Hash(ls("pcsl_key")) === key_hash[0]) {
		content_level = 1;
		key = ls("pcsl_key");
	}
	// level 1 url para
	else if (key !== "" && await getSHA384Hash(key) === key_hash[0]) {
		content_level = 1;
		load_from_storage = false;
		ls("pcsl_key", key);
	}
	key_valid = Boolean(content_level);
	if (key_valid) {
		rep_singer = [1, 1, 1, 1, 1, 1];
	}
	// load data
	let local_version_hash = ls("pcsl_version_hash");
	//  data version is up to date             key did not update
	if (local_version_hash === version_hash && load_from_storage) {
		// good to use old data
		let ls_data = ls("pcsl_data").split("\n");
		video = JSON.parse(decrypt(ls_data[0]));
		entry = JSON.parse(decrypt(ls_data[1]));
		init();
	} else {
		// need to refresh data
		$("#loading_text").html("Downloading data...");
		fetch(`data/data_${content_level}.txt`)
		.then(response => {
			if (!response.ok) {
				console.log(`failed to load data_${content_level}.txt`);
				$("#loading_text").html("Failed to download data.<br />Please reload to try again.<br /><br />Contact site administrator<br />if this problem persists.");
			}
			return response.text();
		})
		.then(data => {
			const objs = data.split("\n");
			video = JSON.parse(decrypt(objs[0]));
			entry = JSON.parse(decrypt(objs[1]));

			// save to local storage
			ls("pcsl_data", data);
			ls("pcsl_version_hash", version_hash);
			init();
		});
	}
	
	// changing thing if key valid
	if (key_valid) {
		member_display_order = [7, 6, 5, 3, 4, 2, 1, 32, 16, 8];
		$(".extra").removeClass("hidden");
		$(".memcount_subblock").removeClass("anti_extra");
		$(".anti_extra").html("");
		$(".anti_extra").addClass("hidden");
		$("#home_key").removeClass("hidden");
		$("#filter_entry_icon_container").addClass("hidden");
		$("#filter_entry_icon_extra").removeClass("hidden");
	} else {
		part_filter = [1, 1, 1, 0, 0, 0];
	}

	// disable PWA install option on PWA mode, or installed flag exist in local storage
	if (window.matchMedia("(display-mode: standalone)").matches || ls("pcsl_pwa_installed")) {
		ls("pcsl_pwa_installed", 1);
	}
});

function init() {
	$("#loading_text").html("Processing data...");

	load_setting_flags();
	process_data();
	load_url_para();

	// remove loading screen
	$("#loading_text").html("Loading Complete.<br />You can't see this tho");
	$("#loading_overlay").addClass("hidden");
	$("body").removeClass("allow_reload");
}

function load_setting_flags() {
	// change settings selected theme
	$(`#three_way_${ls("theme") === "extra" ? "dark" : ls("theme")}`).addClass("selected");

	function new_key(key, val) {
		ls(key, typeof val === "number" ? val : val ? 1 : 0);
	}

	const do_default = new URLSearchParams(window.location.search).has("reset_settings");
	if (do_default) {
		ls("theme", "mixed");
	}
	Object.entries(settings).forEach(([index, item]) => {
		if (!item.req_LS) {
			return;
		}
		const key = `pcsl_${index}`;
		if (do_default) {
			localStorage.removeItem(key);
			ls(key, typeof item.value === "number" ? item.value : item.value ? 1 : 0);
			return;
		}

		let result = ls(key);
		if (!result) {
			// check if no older key
			if (!settings[index].prv_name?.length) {
				// new user, add new key
				new_key(key, item.value);
				return; 
			}
			// old user, yes older key
			const old_setting = settings[index].prv_name.find(x => ls(x));
			if (old_setting) {
				result = ls(old_setting);
				localStorage.removeItem(old_setting);
				ls(key, result);
			} else {
				new_key(key, item.value);
				return;
			}
		}
		const dflt = settings[index].value;
		// read key if exist
		switch (result) {
			case "0":
			case "1":
				settings[index].value = result == 1;
				break;
			default: 
			settings[index].value = parseInt(result);
		}
		result = settings[index].value;
		const changed = settings[index].value !== dflt;
		// change the selected option insetting menu as well
		let target = `#setting_${index}>div`;
		switch (index) {	// non-default: special case
			case "set_hidden_unlocked":
				if (settings[index].value) {
					$("#setting_extra_container").removeClass("hidden");
				}
				return;
			case "set_show_hidden":
				if (changed) {
					$(".settings_extra").removeClass("hidden");
					if (!/Android/i.test(navigator.userAgent)) {
						$("#setting_intent_container").addClass("hidden");
					}
				}
				break;
			case "ser_rand_show":
				$("#nav_search_random").toggleClass("blank", !result);
				$(".setting_req_random").toggleClass("disabled", !result);
				break;
			case "rep_long_press_time":
				if (changed) {
					$("#three_way_time>div").removeClass("selected");
					$(`#three_way_${result}`).addClass("selected");
				}
				return;
			case "rep_show_artist":
				target = ".rep_tweet_a";
				break;
			case "rep_long_press_copy":
				$("#three_way_time").toggleClass("disabled", !result);
				break;
			case "rep_show_group":
				$("#filter_set").toggleClass("hidden", !result)
				break;
		}
		if (changed) {
			$(target).toggleClass("selected");
		}
	});
	switch (ls("theme")) {
		case "light":
		case "mixed":
			$("#setting_dark_container>div").addClass("disabled");
			break;
		case "extra":
			$("#setting_dark").click();
	}
	
	// remove old flags
	for (let i = localStorage.length - 1; i >= 0; --i) {
		const key = localStorage.key(i);
		if (key && key.startsWith("pcsl_s_")) {
			localStorage.removeItem(key);
		}
	}

}

function process_data() {
	$("#input").val("");
	// process data
	{
		// reverse video dates
		const date_start = new Date("2021-01-01");

		function getDateText(passed) {
			let result = new Date(date_start);
			result.setDate(date_start.getDate() + passed);
			return result.toISOString().slice(0, 10);
		}
		
		for (let i in video) {
			video[i][video_idx.date] = getDateText(video[i][video_idx.date]);
		}
		
		// reverse note
		for (let i in entry) {
			entry[i][entry_idx.note] = note_index[entry[i][entry_idx.note]];
		}
		// remove note index
		note_index = null;
	}
	for (let i in song) {
		entry_proc[i] = [];
	}
	for (let i = 0; i < entry.length; ++i) {
		if (entry[i][entry_idx.type]) {
			entry_proc[entry[i][0]].push(i);
		}
	}
	$("#info_version").html(version);
	$("#info_last-update").html(video[video.length - 1][video_idx.date]);
	// get screen size
	auto_display_max = Math.floor(7 * window.innerHeight / window.innerWidth);
	
	// rep
	let rep_solo_temp = [];
	
	// process song names
	for (let i = 1; i < song.length; ++i) {
		processed_song_name.push(song[i][song_idx.name].toLowerCase().normalize("NFKC").trim());
		if (i > 2 && song[i][song_idx.name].trim() === song[i - 1][song_idx.name].trim()) {
			auto_skips.push(i);
		}
	}
	
	// get each member's repertoire
	for (let i = 0; i < song.length; ++i) {
		rep_list[i] = 0;
		for (let j in entry_proc[i]) {
			// or is faster than checking then add (i think)
			rep_list[i] |= entry[entry_proc[i][j]][entry_idx.type];
		}
		
		rep_solo_temp[i] = [...new Set(entry_proc[i])];
		rep_hits_solo[i] = [];
		for (let j in rep_solo_temp[i]) {
			rep_hits_solo[i] = rep_hits_solo[i].concat(split_to_solo(entry[rep_solo_temp[i][j]][entry_idx.type]));
		}
		rep_hits_solo[i] = [...new Set(rep_hits_solo[i])].filter(Number);
	}
}

function load_url_para() {
	let url_para = new URLSearchParams(window.location.search);
	// remove key
	url_para.delete("key");
	url_para.delete("reset_settings");
	window.history.pushState(null, null, `${document.location.href.split('?')[0]}${url_para.size ? `?${url_para}` : ""}`);
	if (url_para.get("sfilter")) {
		// extract member data
		let ext = Number(url_para.get("sfilter"));
		// bit and = true => default 
		const member_name = [
			ext & 1 ? "" : "nia",
			ext & 2 ? "" : "momo",
			ext & 4 ? "" : "kirara",
			ext & 8 ? "" : "yuco",
			ext & 16 ? "" : "shiro",
			ext & 32 ? "" : "chui"
		];
		// rep
		if (url_para.get("page") === "rep" || url_para.get("rfilter")) {
			member_name.forEach(x => x ? $(`#filter_icon_container .icon_${x}`).click() : null);
		}
		//search
		if (url_para.get("page") === "search" || url_para.get("search")) {
			member_name.forEach(x => x ? $(`.singer_icon.icon_${x}`).click() : null);
		}
	}
	let target_page = url_para.get("page");
	if (target_page && target_page !== "home") {
		jump2page(target_page);
	}
	if (url_para.get("search") !== null) {
		if (current_page !== "search") {
			jump2page("search");
		}
		// prevent out of range
		let song_id = url_para.get("search").split(",");
		if (song_id.length > 1) {
			let added_song = 0;
			for (let i in song_id) {
				// check if valid
				let temp = parseInt(song_id[i]);
				if (temp >= 1 && temp < song.length) {
					hits[added_song++] = song_lookup[temp];
				}
			}
			is_searching_from_rep = 1;
			search_memory = "!bulk_load_flag";
			update_display(1);
		} else if (song_id >= 1 && song_id < song.length) {
			$("#input").val(song[song_lookup[song_id]][song_idx.name]);
			$("#input").blur();
		}
	}
	/*    rep filter
	 * this read a string of binary number
	 * the value is exactly the same as rep_anisong and rep_genre
	 */
	if (url_para.get("rfilter") !== null) {
		if (current_page !== "repertoire") {
			jump2page("rep");
		}
		// extract bits
		let selected_bits = [];
		let temp = Number(url_para.get("rfilter"));
		let counter = 0;
		while (temp) {
			// test if last bit is 1
			if (temp % 2) {
				selected_bits.push(counter);
			}
			// remove last bit, add counter
			temp >>= 1;
			counter++;
		}
		// click all checkbox thats NOT selected
		for (let i in rep_anisong) {
			if (!selected_bits.includes(rep_anisong[i][1])) {
				$("#anisong_" + i).click();
			}
		}
		for (let i in rep_genre) {
			if (!selected_bits.includes(rep_genre[i][1])) {
				$("#general_" + i).click();
			}
		}
	}
}

$(function() {
	{ // PWA
		$(window).on("beforeinstallprompt", function(e) {
			e.preventDefault();
			localStorage.removeItem("pcsl_pwa_installed");
			deferred_prompt = e.originalEvent || e;
			$("#menu_install").removeClass("disabled");
			$("#menu_bottom").addClass("pwa_installable");
		});

		$(window).on("appinstalled", function() {
			ls("pcsl_pwa_installed", 1);
			deferred_prompt = null;
			$("#menu_install").addClass("disabled");
			$("#menu_bottom").removeClass("pwa_installable");
		})
	}

	{ // nav
		// nav - menu
		$(document).on("click", "#nav_menu", function(e) {
			// disable going back to top
			e.preventDefault();
			if (prevent_menu_popup) {
				return;
			}
			$("#menu_container").toggleClass("hidden");
			$("#nav_menu").toggleClass("menu_opened");
			$(document.body).toggleClass("no_scroll");
		});
		
		// nav - to_top
		$(document).on("click", "#nav_to_top", function(e) {
			e.preventDefault();
			if (prevent_menu_popup) {
				return;
			}
			let scrollTop = $("html,body").scrollTop();
			let delta = scrollTop / 33;
			function frame() {
				scrollTop -= delta;
				$("html,body").scrollTop(scrollTop);
				if (scrollTop <= 0)
					clearInterval(id)
			}
			let id = setInterval(frame, 1);
			if (current_page === "repertoire" && settings.rep_selected_first.value) {
				rep_display();
			}
		});
	}
	
	{ // menu
		// menu -fog> return
		$(document).on("click", "#menu_container", function(e) {
			if (!($(e.target).parents(".defog").length || $(e.target).hasClass("defog"))) {
				$("#menu_container").addClass("hidden");
				$("#nav_menu").removeClass("menu_opened");
				$(document.body).removeClass("no_scroll");
			}
		});
		
		// menu -> page
		$(document).on("click", ".menu2page", function(e) {
			let target = ($(e.target).attr("id")).replace("menu2page_", "");
			if (target === current_page) {
				return;
			}
			jump2page(target);
			
			// close menu
			$("#menu_container").addClass("hidden");
			$("#nav_menu").removeClass("menu_opened");
			$(document.body).removeClass("no_scroll");
		});
		
		// menu - install
		$(document).on("click", "#menu_install:not(.disabled)", async function() {
			deferred_prompt.prompt();
			const result = await deferred_prompt.userChoice;
			if (result.outcome === "accepted") {
				// fire the event for dry
				window.dispatchEvent(new Event("appinstalled"));
			}
		});

		// menu - setting
		$(document).on("click", "#menu_setting", function() {
			// hide / show things
			$("#popup_container").removeClass("hidden");
			$("#settings").removeClass("hidden");
			$("#menu_container").addClass("hidden");
			$("#nav_menu").removeClass("menu_opened");
			prevent_menu_popup = true;
		});

		// menu - mem_count
		$(document).on("click", "#menu_count", function() {
			// hide / show things
			$("#popup_container").removeClass("hidden");
			$("#memcount").removeClass("hidden");
			$("#menu_container").addClass("hidden");
			$("#nav_menu").removeClass("menu_opened");
			prevent_menu_popup = true;
			
			// generate if not generated
			if ($("#memcount_content").html() !== "") {
				return;
			}
			// is empty, generate
			let entry_count = [];
			// entry_count[singer_id][0:public, 1:member, 2:private]
			for (let i = 0; i < 33; ++i) {
				entry_count[i] = [0, 0, 0];
			}
			for (let i = 0; i < entry.length; ++i) {
				if (is_private(i)) {
					entry_count[entry[i][entry_idx.type]][2]++;
					continue;
				}
				if (entry[i][entry_idx.note].includes("【メン限")) {
					entry_count[entry[i][entry_idx.type]][1]++;
					continue;
				}
				entry_count[entry[i][entry_idx.type]][0]++;
			}
			
			// output as html
			let new_html = `<table id="memcount_table"><tr><th></th><th>通常</th><th>メン限</th><th>非公開</th></tr>`;
			for (let i in member_display_order) {
				let mem_id = member_display_order[i];
				// new row, name
				new_html += `<tr class="memcount_row"><td class="memcount_name singer_${mem_id}"><div>${singer_lookup[mem_id]}</div></td>`;
				for (let j = 0; j < 3; ++j) {
					new_html += `<td class="${entry_count[mem_id][j] === 0 ? "memcount_empty" : `singer_${mem_id}`}">${entry_count[mem_id][j]}</td>`;
				}
				// close row
				new_html += "</tr>";
			}
			
			// total for each member
			// get numbers
			let entry_count_total = [0, 0, 0, 0, 0, 0];
			for (let i in entry) {
				let solo_output = split_to_solo(entry[i][entry_idx.type])
				for (let j in solo_output) {
					entry_count_total[part_rom.indexOf(solo_output[j])]++;
				}
			}
			if (key_valid) {
				new_html += `</table><div id="memcount_sum_warpper" class="memcount_sum"><div class="memcount_sum_icon col-1 colspan-2"></div>`;
				for (let row = 0; row < 2; ++row) {
					for (let col = 2; col >= 0; --col) {
						new_html += `<div class="singer_${1 << (row * 3 + col)}">${entry_count_total[row * 3 + col]}</div>`;
					}
					new_html += "<div></div>";
				}
			} else {
				new_html += `</table><div class="memcount_sum"><div class="memcount_sum_icon"></div>`;
				for (let i = 2; i >= 0; --i) {
					new_html += `<div class=\"singer_${(1 << i)}">${entry_count_total[i]}</div>`;
				}
			}
			$("#memcount_content").html(new_html + "</div>");
			
			// rep part - load in background
			memcount_rep_int = setInterval(memcount_load_rep , 1);
		});
		
		// menu - information
		$(document).on("click", "#menu_info", function() {
			$("#popup_container").removeClass("hidden");
			$("#information").removeClass("hidden");
			$("#menu_container").addClass("hidden");
			$("#nav_menu").removeClass("menu_opened");
			prevent_menu_popup = true;
		});
	}
	
	{ // settings

		// unlock hidden settings
		let title_clicked = 0;
		$(document).on("click", function(e) {
			if ($(e.target).closest(".settings_title").length) {
				if (++title_clicked === 5 && ls("pcsl_set_hidden_unlocked") !== "1") {
					ls("pcsl_set_hidden_unlocked", 1);
					// show settings here
					$("#setting_extra_container").removeClass("hidden");
					// disable extra dark if not already in dark mode
					$("#setting_dark").toggleClass("disabled", settings.theme !== "dark");
				}
			} else {
				title_clicked = 0;
			}
		})

		// general - display_theme
		$(document).on("click", "#three_way_theme>div", function() {
			let selected = this.id.replace("three_way_", "");
			$("#setting_dark").toggleClass("disabled", selected !== "dark");
			if (selected !== "dark") {
				$("#setting_dark>div").removeClass("selected");
				$("#dark_normal").addClass("selected");
			}
			document.documentElement.setAttribute("theme", selected);
			ls("theme", selected);
			$("#three_way_theme>div").removeClass("selected");
			$(this).addClass("selected");
			
			// set post-switch bg colour
			// does not account for cross origin, not needed anyways
			parent.refresh_bgColour();
		});

		// rep - long press length
		$(document).on("click", "#three_way_time>div", function() {
			if ($(".setting_copy_time").hasClass("disabled")) {
				return;
			}
			let time = parseInt(this.id.replace("three_way_", ""));
			ls("pcsl_rep_long_press_time", time);
			settings.rep_long_press_time.value = time;
			$("#three_way_time>div").removeClass("selected");
			$(this).addClass("selected");
		});

		// settings - other options
		$(document).on("click", ".two_way:not(.disabled)", function() {
			$(this).children().toggleClass("selected");
			const key = this.id.replace("setting_", "");
			switch (key) {
				case "set_show_hidden":
					$(".settings_extra").toggleClass("hidden", toggle_setting(key));
					if (!/Android/i.test(navigator.userAgent)) {
						$("#setting_intent_container").addClass("hidden");
					}
					break;
				case "dark":
					let cur_state = $("#dark_extra").hasClass("selected") ? "extra" : "dark";
					ls("theme", cur_state);
					document.documentElement.setAttribute("theme", cur_state);
					break;
				case "use_intent":
					intent_update(toggle_setting(key));
					break;
				case "ser_show_private":
					toggle_setting(key);
					update_display(1);
					break;
				case "ser_rand_show":
					const rs = toggle_setting(key);	// *r*and_*s*how
					$("#nav_search_random").toggleClass("blank", rs);
					$(".setting_req_random").toggleClass("disabled", !rs);
					break;
				case "ser_rand_req_empty":
					toggle_setting(key);
					$("#nav_search_random").toggleClass("disabled", settings.ser_via_song_name.value ? (settings.ser_rand_req_empty.value ? false : search_memory !== "") : true);
					break;
				case "rep_show_release":
					toggle_setting(key);
					if (current_page === "repertoire") {
						rep_display();
					}
					break;
				case "rep_long_press_copy":
					$(".setting_copy_time").toggleClass("disabled", !toggle_setting(key));
					break;
				case "rep_show_group":
					$("#filter_set").toggleClass("hidden", !toggle_setting(key));
					break;
				case "ser_select_input":
				case "pdt_on_change_only":
				case "pdt_reading":
				case "pdt_copy_on_select":
				case "rep_select":
					toggle_setting(key);
					break;
			}
		});

		// settings - reset button, reset cancel
		$(document).on("click", "#settings_reset_button, #settings_reset_nah", function() {
			$(".settings_reset>span").toggleClass("hidden");
			$("#settings_reset_confirm").toggleClass("blank");
		});

		// settings - reset confirm
		$(document).on("click", "#settings_reset_yes", function() {
			const currentUrl = new URL(window.location.href);
			currentUrl.searchParams.set("reset_settings", "");
			window.location.href = currentUrl.toString();
		});
	}

	// memcount swap content
	$(document).on("click", "#memcount, #memcount_rep", function(e) {
		if ($(e.target).closest('.popup_frame').length) {
			$(".memcount_subblock").toggleClass("hidden");
		}
	});
	
	// popup - return
	$(document).on("click", "#popup_container", function(e) {
		// all popup except rep share
		if (!$(e.target).closest('.popup_frame').length) {
			$(".popup_frame").addClass("hidden");
			$("#popup_container").addClass("hidden");
			$(document.body).removeClass("no_scroll");
			prevent_menu_popup = false;
		}
	});
	
	// home - member icon
	$(document).on("click", ".home_member_icon_bg", function() {
		jump2page("rep");

		$(".filter_icon").removeClass("selected");
		rep_singer.fill(0);
		$(`.filter_icon.${$(this).children().attr("class")}`).click();
	})

	// home - delete key - button, cancel
	$(document).on("click", "#home_key_reset_button, #home_key_reset_nah", function() {
		$(".home_key_reset>span").toggleClass("hidden");
		$("#home_key_comfirm").toggleClass("blank");
	});

	// home - delete key - confirm
	$(document).on("click", "#home_key_reset_yes", function() {
		localStorage.removeItem("pcsl_version_hash");
		localStorage.removeItem("pcsl_key");
		window.location = window.location.href.split("?")[0];
	});
});


// memcount - loading rep part in background
function memcount_load_rep() {
	// remove interval
	clearInterval(memcount_rep_int);
	
	// get number for each member
	let singer_counter = [];
	for (let i = 0; i < 33; ++i) {
		singer_counter[i] = [];
	}
	for (let i in rep_hits_solo) {
		for (let j in rep_hits_solo[i]) {
			let bits = split_to_solo(rep_hits_solo[i][j]);
			for (let k in bits) {
				singer_counter[bits[k]].push(i);
			}
		}
	}
	// remove duplicates
	singer_counter.map(x => [...new Set(x)]);
	let display_number = [
		singer_counter[4].length,
		singer_counter[2].length,
		singer_counter[1].length,
		
		singer_counter[32].length,
		singer_counter[16].length,
		singer_counter[8].length,
		
		new Set([...singer_counter[4], ...singer_counter[32]]).size,
		new Set([...singer_counter[2], ...singer_counter[16]]).size,
		new Set([...singer_counter[1], ...singer_counter[8]]).size
	];
	
	let display_lookup = [4, 2, 1, 32, 16, 8, 4, 2, 1];
	
	// display
	let new_html = "";
	for (let i = 0; i < (key_valid ? 6 : 3); ++i) {
		new_html += `<div class="memcount_rep_block"><div class="singer_${display_lookup[i]} memcount_rep_name">${singer_lookup[display_lookup[i]]}</div><div class="singer_${display_lookup[i]}">${display_number[i]}</div></div>`;
	}
	if (key_valid) {
		new_html += `<div></div><div class="memcount_rep_sum"></div><div></div>`;
		for (let i = 6; i < 9; ++i) {
			new_html += `<div class="memcount_rep_block_sum memcount_rep_singer_${display_lookup[i]}"><div>${display_number[i]}</div></div>`;
		}
	}
	$("#memcount_rep_content").toggleClass("extra_content", key_valid);
	$("#memcount_rep_content").html(new_html);
}

// setting - intent switch
function intent_update(use_intent) {
	console.log(use_intent);
	if (use_intent) {
		$(`a[href*="youtu"], a[href*="twitter"]`).each(function() {
			$(this).attr("href", `${$(this).attr("href").replace("https", "intent")}#Intent;` +
			`package=com.example.app;scheme=https;S.browser_fallback_url=${$(this).attr("href")};end`);
		});
	} else {
		$(`a[href^="intent"]`).each(function() {
			$(this).attr("href", $(this).attr("href").replace("intent", "https").replace(/#Intent.*/, ""));
		});
	}
}

// functional functions

// display date in yyyy-MM-dd format
function display_date(input) {
	let e = typeof(input) === "string" ? new Date(input) : input;
	return (e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0"));
}

const private_regex = /非公開|記録用|アーカイブなし/;
function is_private(index) {
	return private_regex.test(entry[index][entry_idx.note]);
}

// rap the `selc` section in bold tag if exist in `org`
function bold(org, selc) {
	let e = org.toLowerCase().indexOf(selc.toLowerCase());
	if (e === -1 || selc === "") {
		return org;
	} else {
		return (org.substring(0, e) + "<b>" + org.substring(e, e + selc.length) + "</b>" + org.substring(e + selc.length));
	}
}

function copy_of(input) {
	if (typeof input === "object") {
		return JSON.parse(JSON.stringify(input));
	} else {
		return input;
	}
}

function get_last_sang(id, mask = [4, 2, 1, 32, 16, 8]) {
	for (let i = entry_proc[id].length - 1; i >= 0; --i) {
		if (mask.some((x) => (x & entry[entry_proc[id][i]][entry_idx.type]) === x)) {
			return new Date(video[entry[entry_proc[id][i]][entry_idx.video]][video_idx.date]);
		}
	}
	// not found;
	return 0;
}

// returns a date object for a "dd-mm-yyyy" input
function to8601(date_string) {
	try {
		return new Date(
			date_string.substring(6),
			parseInt(date_string.substring(3, 5)) - 1,
			date_string.substring(0, 2)
		);
	} catch {
		console.log(date_string + " is not in dd-MM-yyyy format");
		return -1;
	}
}

const today = new Date().setHours(0, 0, 0, 0);

// get day different between {date1 and date2} or {date1 and today}
function get_date_different(date1, date2 = today) {
	date1 = (typeof(date1) === "string") ? new Date(date1) : date1;
	date2 = date2 === undefined ? date2 : new Date(date2);
	return Math.round(Math.abs(date1 - date2) / 86400000);
}

// get entry count of all entry and member-only entry that fufills mask
function get_sang_count(id, mask = [4, 2, 1, 32, 16, 8]) {
	let count = 0,
		mem_count = 0;
	for (let i in entry_proc[id]) {
		if (mask.some((x) => (x & entry[entry_proc[id][i]][entry_idx.type]) === x)) {
			count++;
			if (entry[entry_proc[id][i]][entry_idx.note].includes("【メン限")) {
				mem_count++;
			}
		}
	}
	return [count, mem_count];
}

function jump2page(target) {
	target = new Object({"rep": "repertoire", "repertoire": target, "search": target, "home": target})[target];
	if (!target) {
		return;
	}
	current_page = target;
	$(".menu2page_selected").removeClass("menu2page_selected");
	$("#menu2page_" + target).addClass("menu2page_selected");
	// show / hide section
	$(".section_container").addClass("hidden");
	$("#" + target + "_section").removeClass("hidden");
	$("#nav_control_group div:not(#nav_to_top)").addClass("hidden");
	// remove previously generated comtent
	$("#search_display").html("");
	$("#rep_display").html("");
	switch (target) {
		case "home" : 
			// show section
			$("#nav_title").html("ホーム");
			$("#nav_dummy").removeClass("hidden");
			break;
		case "search" :
			// show section
			$("#nav_search_random").removeClass("hidden");
			$("#nav_title").html("曲検索");
			// reset input -> reload
			search_memory = "";
			search();
			break;
		case "repertoire" : 
			// show section
			$("#repertoire_section").removeClass("hidden");
			$("#nav_share").removeClass("hidden");
			$("#nav_share").toggleClass("disabled", !rep_selected.length);
			$("#nav_title").html("レパートリー");
			// do whatever needed
			rep_input_memory = "";
			rep_search();
			break;
		default :
			// error **this is used code**
			return -1;
	}
	$(window).scrollTop(0);
}

function split_to_solo(input) {
	// hard code is easier
	switch (input) {
		case 3 : 
			return [1, 2];
		case 5 : 
			return [1, 4];
		case 6 : 
			return [2, 4];
		case 7 : 
			return [1, 2, 4];
		case 10:
			return [2, 8];
		case 12:
			return [4, 8];
	}
	return [input];
}

let copy_popup_flag = false;

function copy_popup() {
	if (copy_popup_flag) {
		return;
	}
	copy_popup_flag = true;
	$("#copy_popup").attr("class", "fade_out");
	setTimeout(() => {
		copy_popup_flag = false;
		$("#copy_popup").attr("class", "hidden");
	}, 1500);
}

function to_html(input) {
	return input.replaceAll(`"`, `&quot;`).replaceAll(`'`, `&apos;`);
}

function to_non_html(input) {
	return input.replaceAll(`&quot;`, `"`).replaceAll(`&apos;`, `'`);
}

// from : https://stackoverflow.com/a/67600346/20897145
const getSHA384Hash = async (input) => {
	const textAsBuffer = new TextEncoder().encode(input);
	const hashBuffer = await window.crypto.subtle.digest("SHA-384", textAsBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hash = hashArray
		.map((item) => item.toString(16).padStart(2, "0"))
		.join("");
	return hash;
};

function refresh_bgColour() {
	document.documentElement.setAttribute("theme", ls("theme"));
}

function ls(key, value) {
	return value === undefined ? localStorage.getItem(key) : localStorage.setItem(key, value);
}