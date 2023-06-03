// display string, refered in entry[].type
var singer_lookup = {
 0 :	"reserved",			// 0b 0000 0x 0
 1 :	"看谷にぃあ",		//    0001    1
 2 :	"胡桃澤もも",		//    0010    2
 3 :	"ももにぃあ",		//    0011    3
 4 :	"逢魔きらら",		//    0100    4
 5 :	"きらにぃあ",		//    0101    5
 6 :	"ももきら",			//    0110    6
 7 :	"ぷちここ",			//    0111    7
 9 :	"つきみゆこ",		//    1001    9
10 :	"愛白ふりる",		//    1010    A
12 :	"小悪熊ちゅい",		//    1100    C
19 :	"ゆこもも",			//   10011   13
21 :	"ゆこきら",			//   10101   15
};

// display order of search
var display_order = [
	-1,		// 0000
	7, 		// 0001
	6,		// 0010
	4,		// 0011
	5,		// 0100
	3,		// 0101
	2,		// 0110
	1,		// 0111
	-1,		// 1000
	14,		// 1001
	13,		// 1010
	11,		// 1011
	12,		// 1100
	10,		// 1101
	9,		// 1110
	8,		// 1111
];

// display order of rep display
var member_display_order = [
	7,
	6,
	5,
	3,
	4,
	2,
	1
];

// series search
var series_lookup = {
	"マクロス" : ["マクロス", "まくろす"],
	"ラブライブ" : ["ラブライブ", "らぶらいぶ", "LL", "ll"],
	"アイマス" : ["アイマス", "あいます", "デレマス", "でれます"],
	"ジブリ" : ["ジブリ", "じぶり"],
	"物語シリーズ" : ["物語シリーズ", "ものがたりしりーず", "ものがたりシリーズ"],
	"まどマギ" : ["まどマギ", "まどまぎ", "まどか"],
};

// indices lookup
var entry_idx = {
	song_id : 0,
	video : 1,
	note : 2,
	time : 3,
	type : 4
};
var song_idx = {
	name : 0,
	artist : 1,
	reading : 2,
	attr : 3,
	release : 4,
	reference : 5
};
var video_idx = {
	id : 0,
	date : 1
};

var version = "1.5.1a";

var key_hash = [
	"473c05c1ae8349a187d233a02c514ac73fe08ff4418429806a49f7b2fe4ba0b7a36ba95df1d58b8e84a602258af69194", //thereIsNoPassword
	"3f01e53f1bcee58f6fb472b5d2cf8e00ce673b13599791d8d2d4ddcde3defbbb4e0ab7bc704538080d704d87d79d0410"
];

/* control / memories */

// prevent menu from opening when info or setting is up
var prevent_menu_popup = false;

// current page name
var current_page = "home";

// key inputed check
var key_valid = 0;

/* setting section */
// max display song count
var max_display = 100;

// if on, display private entries despite not accessable
var do_display_hidden = true;

// if the previous input should be cleared when user tap input box
var do_clear_input = false;

// if random requirement is ignored (input being blank)
var do_random_anyway = false;

// hidden hard filter
var hard_filter = 0b111;

// do add the link to this website when sharing
var do_share_web = false;

// ram for searching (entry_processed)
var entry_proc = [];

// memcount - rep generate interval flag
var memcount_rep_int;

// pre-process song names
var processed_song_name = [""];

$(window).on("load", async function() {
	var url_para = new URLSearchParams(window.location.search);
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		// on mobile, do nothing
	} else {
		// check screen ratio
		// and hope nobody use some super-duper long screen
		if (window.innerHeight / window.innerWidth < 1.3) {
			// bad screen ratio, open new window
			$("#v_screen").addClass("post_switch");
			$("#v_screen").height("100%");
			$("#v_screen").width(0.5625 * window.innerHeight);
			$("#v_screen").attr("src", "index.html" + window.location.search);
			// hide original page
			$("body > div").addClass("post_switch");
			$("body").addClass("post_switch");
			url_para.delete("key");
			window.history.replaceState(null, null, "?" + url_para.toString());
			return;
		}
	}
	do {
		// 1.   private key
		// 1-1. if have valid key in cookie
		if (await getSHA384Hash(getCookie("pcsl_content_key")) === key_hash[1]) {
			load_encrpyted_data(1);
			break;
		}
		
		// 1-2. scan for url para
		var key = url_para.get("key");
		// if key para exist and sha384 hash matches
		if (key !== "" && await getSHA384Hash(key) === key_hash[1]) {
			// save to cookie
			setCookie("pcsl_content_key", key);
			url_para.delete("key");
			window.history.replaceState(null, null, "?" + url_para.toString());
			load_encrpyted_data(1);
			break;
		}
		
		// 2.   public key
		// 2-1. scan for public key in cookie
		if (await getSHA384Hash(getCookie("pcsl_content_key")) === key_hash[0]) {
			load_encrpyted_data(0);
			break;
		}
		
		// 2-2. scan for url para
		key = url_para.get("key");
		// if key para exist and sha384 hash matches
		if (key !== "" && await getSHA384Hash(key) === key_hash[0]) {
			// save to cookie
			setCookie("pcsl_content_key", key);
			url_para.delete("key");
			window.history.replaceState(null, null, "?" + url_para.toString());
			load_encrpyted_data(0);
			break;
		}
		// wrong key or no key in cookie, delete anyway
		removeCookie("pcsl_content_key");
		// remove extra to prevent ID crash
		$(".extra").html("");
	} while (0);
	
	// remove encryped data
	entry_enc = [null, null];
	video_enc = [null, null];
	
	// get settings from cookie
	if (getCookie("pcsl_settings_display") === "") {
		// cookie not set
		setCookie("pcsl_settings_display", 100);
		setCookie("pcsl_settings_hidden" , 1);
		setCookie("pcsl_settings_clear"  , 0);
		setCookie("pcsl_settings_random" , 0);
		setCookie("pcsl_settings_share"  , 0);
	} else {
		max_display       = parseInt(getCookie("pcsl_settings_display"));
		do_display_hidden = (getCookie("pcsl_settings_hidden")) === "1";
		do_clear_input    = (getCookie("pcsl_settings_clear")) === "1";
		do_random_anyway  = (getCookie("pcsl_settings_random")) === "1";
		do_share_web      = (getCookie("pcsl_settings_share")) === "1";
		
		// update display
		$("#search_options_count_input").val(max_display);
		$("#search_options_btn_displayHidden").toggleClass("selected", do_display_hidden);
		$("#search_options_btn_reset").toggleClass("selected", do_clear_input);
		$("#search_options_btn_randomAnyway").toggleClass("selected", do_random_anyway);
		$("#search_options_btn_shareWeb").toggleClass("selected", do_share_web);
	}
	
	// processing url para
	if (url_para.get("hfilter") !== (null && "")) {
		// get url para and store
		hard_filter = parseInt(url_para.get("hfilter"));
		setCookie("pcsl_settings_hfilter", hard_filter, 400);
	} else if (getCookie("pcsl_settings_hfilter") !== ""){
		// read from cookie and renew
		hard_filter = parseInt(getCookie("pcsl_settings_hfilter"));
		removeCookie("pcsl_settings_hfilter");
		setCookie("pcsl_settings_hfilter", hard_filter, 400);
	}
	init();
	if (url_para.get("sfilter") !== (null && "")) {
		// extract member data
		var ext = parseInt(url_para.get("sfilter"));
		// bit and = true => default 
		var member_name = [
			ext & 1 ? "" : "nia",
			ext & 2 ? "" : "momo",
			ext & 4 ? "" : "kirara",
			ext & 8 ? "" : "yuco",
			ext & 16 ? "" : "shiro",
			ext & 32 ? "" : "chui"
		];
		// rep
		if (url_para.get("page") === ("rep" || "repertoire")) {
			for (var i in member_name) {
				if (member_name[i] === "") {
					continue;
				}
				$("#filter_" + member_name[i] + "_icon").click();
			}
		}
		//search
		if (url_para.get("page") === "search" || url_para.get("search") !== (null && "")) {
			for (var i in member_name) {
				if (member_name[i].length) {
					$(".singer_icon.icon_" + member_name[i]).click();
				}
			}
		}
	}
	var target_page = url_para.get("page");
	if (target_page !== ("home" || null)) {
		if (jump2page(target_page) === -1) {
			jump2page("home");
		}
	}
	if (url_para.get("search") !== (null && "")) {
		if (current_page !== "search") {
			jump2page("search");
		}
		// prevent out of range
		var song_id = url_para.get("search").split(",");
		if (song_id.length > 1) {
			var added_song = 0;
			for (var i in song_id) {
				// check if valid
				var temp = parseInt(song_id[i]);
				if (temp >= 1 && temp < song.length) {
					hits[added_song++] = song_lookup[temp];
				}
			}
			is_searching_from_rep = 1;
			loading = "!bulk_load_flag";
			update_display(1);
		} else if (song_id >= 1 && song_id < song.length) {
			$("#input").val(song[song_lookup[song_id]][song_idx.name]);
			$("#input").blur();
		}
	}
	// remove loading screen
	$("#loading_overlay").addClass("hidden");
});

$(function() {
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
			$("html,body").animate({
				scrollTop: 0
			}, "fast");
			
			if (current_page === "repertoire" && rep_display_selected_first) {
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
			var target = ($(e.target).attr("id")).replace("menu2page_", "");
			if (target === current_page) {
				return;
			}
			jump2page(target);
			
			// close menu
			$("#menu_container").addClass("hidden");
			$("#nav_menu").removeClass("menu_opened");
			$(document.body).removeClass("no_scroll");
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
			var entry_count = [];
			// entry_count[singer_id][0:public, 1:member, 2:private]
			for (var i = 0; i < 16; ++i) {
				entry_count[i] = [0, 0, 0];
			}
			for (var i = 0; i < entry.length; ++i) {
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
			var new_html = "<table id=\"memcount_table\"><tr><th></th><th>通常</th><th>メン限</th><th>非公開</th></tr>";
			for (var i in member_display_order) {
				var mem_id = member_display_order[i];
				// new row, name
				new_html += ("<tr class=\"memcount_row singer_" + mem_id + "\"><td><div class=\"memcount_name\">" + singer_lookup[mem_id] + "</div></td>");
				for (var j = 0; j < 3; ++j) {
					new_html += ("<td" + (entry_count[mem_id][j] === 0 ? " class=\"memcount_empty\"" : "") + ">" + entry_count[mem_id][j] + "</td>");
				}
				// close row
				new_html += "</tr>";
			}
			
			// total for each member
			// get numbers
			var entry_count_total = [[0, 0, 0], [0, 0, 0]];
			for (var i in entry) {
				for (var j = 0; j < 3; ++j) {
					if ((1 << j) & entry[i][entry_idx.type]) {
						entry_count_total[entry[i][entry_idx.type] > 8 ? 1 : 0][j]++;
					}
				}
			}
			// display (combined sum)
			new_html += "</table><div id=\"memcount_sum_combined\" class=\"memcount_sum\"><div class=\"memcount_sum_icon\"></div>";
			for (var i = 2; i >= 0; --i) {
				new_html += (
					"<div class=\"singer_" + (1 << i) + "\">" + (entry_count_total[0][i] + entry_count_total[1][i]) + "</div>"
				);
			}
			
			// display (seperated sum)
			if (key_valid) {
				new_html += "<div class=\"memcount_sum_seperate memcount_btn\"></div></div><div id=\"memcount_sum_seperated\" class=\"memcount_sum hidden\"><div class=\"memcount_sum_icon col-1 colspan-2\"></div>";
				for (var row = 0; row < 2; ++row) {
					for (var col = 2; col >= 0; --col) {
						new_html += ("<div class=\"row-" + (row + 1) + " col-" + (4 - col) + " singer_" + ((row ? 8 : 0) + (1 << col)) + "\">" + entry_count_total[row][col] + "</div>");
					}
				}
				new_html += "<div class=\"memcount_sum_combine memcount_btn col-5 colspan-2\"></div>";
			}
			new_html += "</div>";
			$("#memcount_content").html(new_html);
			
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
	
	// memcount - sum - swap - sep->com
	$(document).on("click", ".memcount_sum_seperate", function() {
		$("#memcount_sum_seperated").removeClass("hidden");
		$("#memcount_sum_combined").addClass("hidden");
	});
	
	// memcount - sum - swap - com->sep
	$(document).on("click", ".memcount_sum_combine", function() {
		$("#memcount_sum_combined").removeClass("hidden");
		$("#memcount_sum_seperated").addClass("hidden");
	});
	
	// memcount_rep - sum - swap - sep->com
	$(document).on("click", ".memcount_rep_sum_seperate", function() {
		$("#memcount_rep_sum_seperated").removeClass("hidden");
		$("#memcount_rep_sum_combined").addClass("hidden");
	});
	
	// memcount_rep - sum - swap - com->sep
	$(document).on("click", ".memcount_rep_sum_combine", function() {
		$("#memcount_rep_sum_combined").removeClass("hidden");
		$("#memcount_rep_sum_seperated").addClass("hidden");
	});
	
	// memcount -fog> return, swap content
	$(document).on("click", "#memcount", function(e) {
		if ($(e.target).attr("id") === "memcount") {
			$("#memcount").addClass("hidden");
			$("#popup_container").addClass("hidden");
			$(document.body).removeClass("no_scroll");
			prevent_menu_popup = false;
		} else {
			// pressing on the block
			if (!$(e.target).hasClass("memcount_btn")) {
				$(".memcount_subblock").toggleClass("hidden");
			}
		}
	});
	
	// information -fog> return
	$(document).on("click", "#information", function(e) {
		if ($(e.target).attr("id") === "information") {
			$("#information").addClass("hidden");
			$("#popup_container").addClass("hidden");
			$(document.body).removeClass("no_scroll");
			prevent_menu_popup = false;
		}
	});
	
	// key reset
	$(document).on("click", "#home_key_reset", function() {
		$("#popup_container").removeClass("hidden");
		$("#remove_key").removeClass("hidden");
		$("#menu_container").addClass("hidden");
		$("#nav_menu").removeClass("menu_opened");
		$(document.body).addClass("no_scroll");
		prevent_menu_popup = true;
	});
	
	// key reset - yes
	$(document).on("click", "#remove_key_yes", function() {
		removeCookie("pcsl_content_key");
		window.location = window.location.href.split("?")[0];
	});
	
	// key reset - no
	$(document).on("click", "#remove_key_nah", function() {
		$("#remove_key").addClass("hidden");
		$("#popup_container").addClass("hidden");
		$(document.body).removeClass("no_scroll");
		prevent_menu_popup = false;
	});
});

function init() {
	$("#input").val("");
	// process data
	{
		// reverse video dates
		const date_start = new Date("2021-01-01");

		function getDateText(passed) {
			var result = new Date(date_start);
			result.setDate(date_start.getDate() + passed);
			return result.toISOString().slice(0, 10);
		}
		
		for (var i in video) {
			video[i][video_idx.date] = getDateText(video[i][video_idx.date]);
		}
		
		// reverse note
		for (var i in entry) {
			entry[i][entry_idx.note] = note_index[entry[i][entry_idx.note]];
		}
		// remove note index
		note_index = null;
	}
	for (var i in song) {
		entry_proc[i] = [];
	}
	for (var i = 0; i < entry.length; ++i) {
		if (entry[i][entry_idx.type] & hard_filter) {
			entry_proc[entry[i][0]].push(i);
		}
	}
	$("#info_version").html(version);
	$("#info_last-update").html(video[video.length - 1][video_idx.date]);
	// get screen size
	auto_display_max = Math.floor(5 * Math.pow(window.innerHeight / window.innerWidth, 1.41421356237));
	
	// rep
	var rep_solo_temp = [];
	function split_to_solo(input) {
		// hard code is easier
		switch (input) {
			case 1 : 
			case 2 : 
			case 4 : 
			case 9 : 
			case 10 : 
			case 12 : 
				return [input];
				break;
			case 3 : 
				return [1, 2];
				break;
			case 5 : 
				return [1, 4];
				break;
			case 6 : 
				return [2, 4];
				break;
			case 7 : 
				return [1, 2, 4];
		}
	}
	
	// process song names
	for (var i = 1; i < song.length; ++i) {
		processed_song_name.push(song[i][song_idx.name].toLowerCase().normalize("NFKC"));
	}
	
	// get each member's repertoire
	for (var i = 0; i < song.length; ++i) {
		rep_list[i] = 0;
		for (var j in entry_proc[i]) {
			// check if all singer bits are filled
			if ((rep_list[i] & 7) === 7) {
				break;
			}
			// or is faster than checking then add (i think)
			rep_list[i] |= entry[entry_proc[i][j]][entry_idx.type];
		}
		// remove the non-singer bit, not needed.
		rep_list[i] &= ~8;
		
		rep_solo_temp[i] = [...new Set(entry_proc[i])];
		rep_hits_solo[i] = [];
		for (var j in rep_solo_temp[i]) {
			rep_hits_solo[i] = rep_hits_solo[i].concat(split_to_solo(entry[rep_solo_temp[i][j]][entry_idx.type]));
		}
		rep_hits_solo[i] = [...new Set(rep_hits_solo[i])].filter(Number);
	}
}

// decrypt data and replace
function load_encrpyted_data(key_id) {
	key_valid = 1;
	// get key value
	var key = getCookie("pcsl_content_key");
	// decrypt data then delete enc data
	entry = JSON.parse(CryptoJS.AES.decrypt(entry_enc[key_id], key).toString(CryptoJS.enc.Utf8));
	video = JSON.parse(CryptoJS.AES.decrypt(video_enc[key_id], key).toString(CryptoJS.enc.Utf8));
	// update rep display
	member_display_order = [7, 6, 5, 3, 4, 2, 1, 12, 10, 9];
	$(".extra").removeClass("hidden");
	$(".anti_extra").html("");
	$(".anti_extra").addClass("hidden");
	$("#home_key").removeClass("hidden");
	// update expire day
	removeCookie("pcsl_content_key");
	setCookie("pcsl_content_key", key);
}

// memcount - loading rep part in background
function memcount_load_rep() {
	// remove interval
	clearInterval(memcount_rep_int);
	
	// get total sum
	var rep_count = [],
		rep_sum = [[], []];
	for (var i = 0; i < 15; ++i) {
		rep_count[i] = [];
	}
	// get all entry data
	for (var i in entry) {
		rep_count[entry[i][entry_idx.type]].push(entry[i][entry_idx.song_id]);
	}
	// remove duplicate, sort (is sort nessary?)
	for (var i in rep_count) {
		if (rep_count[i].length > 0) {
			rep_count[i] = [...new Set(rep_count[i])].sort((a, b) => a - b);
		}
	}
	
	// assign solo entries into non-solo entries
	// im not sure if rep_list is going to work so not using here
	
	// *note : this does not take account for song that
	// DOES NOT exist in all 1, 2 and 4, but DOES exist in 2 or more of 3, 5 and 6
	
	for (var repeat = 0; repeat < 2; ++repeat) {
		for (var i = 0; i < song.length; ++i) {
			// check which solo array(s) does the song exist in
			var type  = 0,
				found = [];
			for (var j = 0; j < 3; ++j) {
				if (rep_count[1 << j].includes(i)) {
					type += 1 << j;
					found.push(1 << j);
				}
			}
			if (found.length <= 1) {
				continue;
			}
			// found in multiple solo arrays
			rep_count[type].push(i);
		}
		// clone from non-solo to solo
		
		// im going to assume i did the right thing here
		// im not sure if the numbers are correct
		
		for (var i = 1; i < 7; ++i) {
			// remove 7 from 1 to 6
			for (var inner = 0; inner < rep_count[7].length; ++inner) {
				var index = rep_count[i].indexOf(rep_count[7][inner]);
				if (index !== -1) {
					rep_count[i].splice(index, 1);
				}
			}
		}
		var target = [3, 5, 6];
		for (var i in target) {
			// remove 3 from 1 and 2, 5 from 1 and 4 and 6 from 2 and 4
			for (var solos = 0; solos < 3; ++solos) {
				if (!(1 << solos) & target[i]) {
					continue;
				}
				for (var inner = 0; inner < rep_count[target[i]].length; ++inner) {
					var index = rep_count[(1 << solos)].indexOf(rep_count[target[i]][inner]);
					if (index !== -1) {
						rep_count[(1 << solos)].splice(index, 1);
					}
				}
			}
		}
		// remove duplicate
		for (var i in rep_count) {
			if (rep_count[i].length > 0) {
				rep_count[i] = [...new Set(rep_count[i])].sort((a, b) => a - b).filter(Number);
			}
		}
		for (var i in rep_count) {
			rep_sum[repeat][i] = rep_count[i].length;
		}
		if (key_valid && repeat === 0) {
			// is 1st loop
			// it doesnt hurt if executed 2nd time but
			for (var i = 0; i < 8; ++i) {
				rep_count[i] = rep_count[i].concat(rep_count[i + 8]);
			}
		}
	}
	
	// print the table
	var new_html = "<table id=\"memcount_rep_table\"><tr><th></th><th>加算✕</th>" + (key_valid ? "<th class=\"table_empty_column\"></th><th>加算〇</th>" : "") + "</tr>";
	for (var i in member_display_order) {
		var mem_id = member_display_order[i];
		// new row, name
		new_html += ("<tr class=\"memcount_row singer_" + mem_id + "\"><td><div class=\"memcount_name\">" + singer_lookup[mem_id] + "</div></td>");
		// first column
		new_html += ("<td>" + rep_sum[0][mem_id] + "</td>");
		if (key_valid) {
			new_html += "<td></td><td" + (mem_id > 8 ? " class=\"memcount_empty\"" : "") + ">" + (mem_id > 8 ? "" : rep_sum[1][mem_id]) + "</td>";
		}
		// close row
		new_html += "</tr>";
	}
	// total for each member
	// get numbers
	var entry_count_total = [
		[
			rep_sum[1][7] + rep_sum[1][6] + rep_sum[1][5] + rep_sum[1][4],
			rep_sum[1][7] + rep_sum[1][6] + rep_sum[1][3] + rep_sum[1][2],
			rep_sum[1][7] + rep_sum[1][5] + rep_sum[1][3] + rep_sum[1][1]
		], [
			rep_sum[0][7] + rep_sum[0][6] + rep_sum[0][5] + rep_sum[0][4],
			rep_sum[0][7] + rep_sum[0][6] + rep_sum[0][3] + rep_sum[0][2],
			rep_sum[0][7] + rep_sum[0][5] + rep_sum[0][3] + rep_sum[0][1],
			rep_sum[0][12],
			rep_sum[0][10],
			rep_sum[0][9]
		]
	];
	// display (combined sum)
	new_html += "</table><div id=\"memcount_rep_sum_combined\" class=\"memcount_sum\"><div class=\"memcount_sum_icon\"></div>";
	for (var i = 0; i < 3; ++i) {
		new_html += ("<div class=\"singer_" + (1 << (2 - i)) + "\">" + entry_count_total[0][i] + "</div>");
	}
	
	// display (seperated sum)
	if (key_valid) {
		new_html += "<div class=\"memcount_rep_sum_seperate memcount_btn\"></div></div><div id=\"memcount_rep_sum_seperated\" class=\"memcount_sum hidden\"><div class=\"memcount_sum_icon col-1 colspan-2\"></div>";
		for (var row = 0; row < 2; ++row) {
			for (var col = 0; col < 3; ++col) {
				new_html += ("<div class=\"row-" + (row + 1) + " col-" + (col + 2) + " singer_" + ((row ? 8 : 0) + (1 << (2 - col))) + "\">" + entry_count_total[1][row * 3 + col] + "</div>");
			}
		}
		new_html += "<div class=\"memcount_rep_sum_combine memcount_btn col-5 colspan-2\"></div>";
	}
	new_html += "</div>";
	$("#memcount_rep_content").html(new_html);
}

// functional functions

// display date in yyyy-MM-dd format
function display_date(input) {
	var e = typeof(input) === "string" ? new Date(input) : input;
	return (e.getFullYear() + "-" + fill_digit(e.getMonth() + 1, 2) + "-" + fill_digit(e.getDate(), 2));
}

// add 0 in front of a number
function fill_digit(input, length) {
	e = "" + input;
	while (e.length < length) {
		e = "0" + e;
	}
	return e;
}

function is_private(index) {
	return entry[index][entry_idx.note].includes("非公開") ||
		   entry[index][entry_idx.note].includes("記録用") ||
		   entry[index][entry_idx.note].includes("アーカイブなし");
}

// rap the `selc` section in bold tag if exist in `org`
function bold(org, selc) {
	var e = org.toLowerCase().indexOf(selc.toLowerCase());
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

function get_last_sang(id, mask = 7) {
	for (var i = entry_proc[id].length - 1; i >= 0; --i) {
		if (entry[entry_proc[id][i]][entry_idx.type] & (mask & hard_filter)) {
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

var today = new Date().setHours(0, 0, 0, 0);

// get day different between {date1 and date2} or {date1 and today}
function get_date_different(date1, date2 = today) {
	date1 = (typeof(date1) === "string") ? new Date(date1) : date1;
	date2 = date2 === undefined ? date2 : new Date(date2);
	return Math.round(Math.abs(date1 - date2) / 86400000);
}

// get entry count of all entry and member-only entry that fufills mask
function get_sang_count(id, mask = 7) {
	var count = 0,
		mem_count = 0;
	for (var i in entry_proc[id]) {
		if (entry[entry_proc[id][i]][entry_idx.type] & (mask & hard_filter)) {
			count++;
			if (entry[entry_proc[id][i]][entry_idx.note].includes("【メン限")) {
				mem_count++;
			}
		}
	}
	return [count, mem_count];
}

function get_attr(id) {
	var e = entry[id][entry_idx.note];
	if (e.includes("ASMR弾き語り")) {
		return "asm";
	}
	if (e.includes("弾き語り")) {
		return "gui";
	}
	if (e.includes("アカペラ")) {
		return "aca";
	}
	return "oke";
}

function jump2page(target) {
	target = target === "rep" ? "repertoire" : target;
	current_page = target;
	$(".menu2page_selected").removeClass("menu2page_selected");
	$("#menu2page_" + target).addClass("menu2page_selected");
	// show / hide section
	$(".section_container").addClass("hidden");
	$("#" + target + "_section").removeClass("hidden");
	$("#nav_dummy").addClass("hidden");
	$("#nav_search_random").addClass("hidden");
	$("#nav_bulk_search").addClass("hidden");
	$("#nav_share").addClass("hidden");
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
			$("#nav_share").removeClass("hidden");
			$("#nav_share").toggleClass("disabled", !is_searching_from_rep);
			$("#nav_title").html("曲検索");
			// reset input -> reload
			$("#input").val("");
			search();
			break;
		case "rep" :
		case "repertoire" : 
			// show section
			$("#repertoire_section").removeClass("hidden");
			$("#nav_bulk_search").removeClass("hidden");
			$("#nav_share").removeClass("hidden");
			$("#nav_share").toggleClass("disabled", !rep_selected.length);
			$("#nav_title").html("レパートリー");
			// do whatever needed
			rep_input_memory = "";
			rep_search();
			break;
		default :
			// error
			return -1;
	}
	$(window).scrollTop(0);
}

var copy_popup_is_displaying = false;

function copy_popup() {
	if (copy_popup_is_displaying) {
		return;
	}
	copy_popup_is_displaying = true;
	$("#copy_popup").attr("class", "fade_out");
	setTimeout(() => {
		copy_popup_is_displaying = false;
		$("#copy_popup").attr("class", "hidden");
	}, 1500);
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

// from w3school
function setCookie(cname, cvalue, exdays = 400) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function removeCookie(cname) {
	document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
}