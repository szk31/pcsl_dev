// stores whats currently looking up
let loading = "";

let part_filter = [1, 1, 1, 1, 1, 1];
const part_rom = [1, 2, 4, 8, 16, 32];

// store song id (song[id]) of folded up songs
let hide_song = new Array();

// max display boxes of autocomplete
let auto_display_max;

// flag : is loading songs from rep selected
let is_searching_from_rep = false;

let input_focused = false;

$(function() {
	// nav - random
	$(document).on("click", "#nav_search_random", function() {
		if($(this).hasClass("disabled") && !setting.random_ignore || prevent_menu_popup) {
			return;
		}
		// check if the song has any visibile record
		let random_song,
			found = sel_member = 0;
		for (let i in part_filter) {
			if (part_filter[i]) {
				sel_member += part_rom[i];
			}
		}
		if (!sel_member) {
			// no body got selected so
			return;
		}
		do {
			random_song = 1 + Math.floor(Math.random() * song.length);
			for (let i in entry_proc[random_song]) {
				if (!(rep_list[random_song] & sel_member) || (!setting.show_hidden && is_private(entry_proc[random_song][i]))) {
					continue;
				}
				found++;
				break;
			}
		} while (found === 0);
		$("#input").val(song[random_song][song_idx.name]);
		is_searching_from_rep = 0;
		search();
	});
	
	{ // search
		// search - input - autocomplete
		$(document).on("input", "#input", function() {
			auto_search();
		});
		
		// search - input - autocomplete - selection
		$(document).on("mousedown", ".auto_panel", function() {
			$("#input").val(to_non_html(this.id));
			// input on blur fires after this so no need to run search here
		});

		// search - input - submit
		$(document).on("blur", "#input", function() {
			$("#search_auto").addClass("hidden");
			input_focused = false;
			is_searching_from_rep ? is_searching_from_rep = 0 : $("#nav_share").toggleClass("disabled", !is_searching_from_rep);
			search();
		});
		
		// search - input::enter -> blur
		$(document).on("keydown", function(e) {
			if (e.keyCode === 13 && current_page === "search") {
				$("#input").blur();
			}
		});
		
		// search - input::focus -> reset, auto complete
		$(document).on("click", "#input, #rep_input", function() {
			if (input_focused) {
				return;
			}
			input_focused = true;
			if (setting.select_input && this.id === "input" ||
			setting.rep_select_input && this.id === "rep_input") {
				let pass = this;
				setTimeout(function() {
					pass.setSelectionRange(0, $(pass).val().length);
				}, 0);
			}
			else if (loading === "!bulk_load_flag" && this.id === "input") {
				$(this).val("");
				$("#nav_search_random").removeClass("disabled");
				$("#nav_share").addClass("disabled");
			}
			if (this.id === "input") {
				auto_search();
			}
		});
		
		// search - collapse option menu
		$(document).on("click", "#search_options_button", function() {
			$("#search_options_button").toggleClass("opened");
			$("#search_options_container").toggleClass("hidden");
		});
		
		// search - options - singer
		$(document).on("click", ".singer_icon", function() {
			let e = parseInt($(this).attr("class").split(/\s+/).find(x => x.startsWith("sing_sel_")).replace("sing_sel_", ""));
			part_filter[part_rom.indexOf(e)] ^= 1;
			// just add a new filter[6] to use at displaying
			$(".sing_sel_" + e).toggleClass("selected");
			loading = "";
			search();
		});
		
		// search - options - method
		$(document).on("click", ".search_option_group1", function() {
			let new_setting = this.id === "search_options_songname";
			if (new_setting === setting.search_by_song) {
				// nothing changed
				return;
			}
			setting.search_by_song = new_setting;
			$(".search_option_group1>.radio").toggleClass("selected");
			$("#input").val("");
			$("#input").attr("placeholder", setting.search_by_song ? "曲名/読みで検索" : "アーティスト名で検索");
			$("#search_display").html("");
			loading = "";
			// disable / renable random
			$("#nav_search_random").toggleClass("disabled", !setting.search_by_song);
		});
		
		// search - options - sort - method
		$(document).on("click", ".search_option_group2", function() {
			let new_setting = thid.id === "search_options_date";
			if (new_setting === setting.search_sort_by_date) {
				// nothing changed
				return;
			}
			setting.search_sort_by_date = new_setting;
			$(".search_option_group2>.radio").toggleClass("selected");
			update_display();
			$("#search_options_asd>.attr_name").html(setting.search_sort_by_date ? 
			(setting.search_sort_asd ? "古い順&nbsp;(⇌新しい順)" : "新しい順&nbsp;(⇌古い順)") : 
			(setting.search_sort_asd ? "正順&nbsp;(⇌逆順)" : "逆順&nbsp;(⇌正順)"));
		});
		
		// search - options - sort - asd/des
		$(document).on("click", ".search_option_group3", function() {
			setting.search_sort_asd ^= 1;
			$("#search_options_asd>.attr_name").html(setting.search_sort_by_date ? 
				(setting.search_sort_asd ? "古い順&nbsp;(⇌新しい順)" : "新しい順&nbsp;(⇌古い順)") : 
				(setting.search_sort_asd ? "正順&nbsp;(⇌逆順)" : "逆順&nbsp;(⇌正順)")
			);
			update_display();
		});
		
		// search - song - hide_song
		$(document).on("click", ".song_name_container", function(e) {
			if ($(e.target).hasClass("song_copy_icon")) {
				return;
			}
			let f = this.id;
			if (hide_song.includes(f)) {
				hide_song.splice(hide_song.indexOf(f), 1);
			} else {
				hide_song.push(f);
			}
			$(".song_" + f).toggleClass("hidden");
			$("#fold_" + f).toggleClass("closed");
		});

		// search - song - copy_name
		$(document).on("click", ".song_copy_icon", function() {
			navigator.clipboard.writeText(song[parseInt(this.id.replace("copy_name_", ""))][song_idx.name]);
			copy_popup();
		});
		
		// search - entry - share
		$(document).on("click", ".entry_share", function(e) {
			e.preventDefault();
			let entry_id = parseInt(this.id.replace("entry_", ""));
			// get video title
			const url = "https://www.youtube.com/watch?v=" + video[entry[entry_id][entry_idx.video]][video_idx.id];

			fetch("https://noembed.com/embed?dataType=json&url=" + url)
			.then(res => res.json())
			.then(function(data) {
				// title of unlisted / private video are returned a 401 error
				if (data.title === undefined) {
					alert("動画タイトル取得できませんでした。");
					return;
				}
				let tweet;
				if (entry[entry_id][entry_idx.time] === 0) {
					tweet = data.title + "\n(youtu.be/" + video[entry[entry_id][entry_idx.video]][video_idx.id] + ")";
				} else {
					tweet = song[entry[entry_id][entry_idx.song_id]][song_idx.name].trim() + " / " + song[entry[entry_id][entry_idx.song_id]][song_idx.artist] + " @" + data.title + "\n(youtu.be/" + video[entry[entry_id][entry_idx.video]][video_idx.id] + timestamp(entry_id) + ")";
				}
				window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet), "_blank");
			});
		});
	}
});

let hits = [];

function auto_search() {
	let input = $("#input").val().normalize("NFKC").toLowerCase().trim();
	if (!input || !setting.search_by_song) {
		$("#search_auto").addClass("hidden");
		return;
	}
	let auto_exact = [],
		auto_other = [];
	
	function add_song(id, found_pos) {
		if (!found_pos) {			// from beginning
			auto_exact.push(id);
		}
		else if (found_pos > 0) {	// exist but not from beginning
			auto_other.push(id);
		}
	}

	// search for series name
	for (let i in series_lookup) {
		if (series_lookup[i].includes(input)) {
			// if string exist in series variations
			auto_exact.push(i);
			break;
		}
	}
	// if input not consist of only hiragana, "ー" or "ヴ"
	const auto_thru_name = /[^\u3040-\u309F\u30FC\u30F4]/.test(input);
	for (let i = 1; i < song.length && auto_exact.length < auto_display_max; ++i) {
		// skip if same song name
		if (auto_skips.includes(i)) {
			continue;
		}
		if (auto_thru_name) {
			let name_pos = processed_song_name[i].indexOf(input);
			// check for special notation in reading
			if (name_pos === -1 && song[i][song_idx.reading].includes(" ") && song[i][song_idx.reading].includes(input)) {
				name_pos = 1;
			}
			add_song(i, name_pos);
		} else {
			add_song(i, song[i][song_idx.reading].indexOf(input));
		}
	}
	// display
	let auto_display_count = 0;
	let new_html = "";
	for (let i in auto_exact) {
		// data being number (song id) or string (series name)
		let auto_reading =  auto_display =  song_name = "";
		if (typeof auto_exact[i] === "string") {
			// series name
			auto_display = song_name = auto_exact[i];
		} else {
			auto_reading = bold(song[auto_exact[i]][song_idx.reading].split(" ")[0], input);
			song_name = song[auto_exact[i]][song_idx.name];
			auto_display = bold(song_name, input);
		}
		new_html += `<div id="${to_html(song_name)}" class="auto_panel${auto_display_count++ === 0 ? " auto_first" : ""}"><div class="auto_reading">${auto_reading}</div><div class="auto_display">${auto_display}</div></div>`;
	}
	for (let i in auto_other) {
		if (auto_display_count++ >= auto_display_max) {
			break;
		}
		new_html += `<div id="${to_html(song[auto_other[i]][song_idx.name])}" class="auto_panel${(auto_display_count === 0 ? " auto_first" : "")}"><div class="auto_reading"></div><div class="auto_display">${bold(song[auto_other[i]][song_idx.name], input)}</div></div>`;
	}
	$("#search_auto").html(new_html);
	$("#search_auto").toggleClass("hidden", !new_html);
}

function search() {
	// ignore blank input if search from rep
	if (is_searching_from_rep) {
		update_display();
		return;
	}
	let search_value = $("#input").val().trim().normalize("NFKC").toLowerCase();
	if (search_value === loading) {
		return;
	}
	loading = search_value;
	if (!search_value) {
		// clear current list
		$("#search_display").html("");
		// enable random
		$("#nav_search_random").removeClass("disabled");
		return;
	}
	// not empty input
	$("#nav_search_random").toggleClass("disabled", !setting.random_ignore);
	
	// series
	const series_name = search_value in series_lookup ? search_value : "",
		  attr_series = attr_idx.includes(search_value) ? attr_idx.indexOf(search_value) : 0;

	hits = [];
	if (series_name) {	// get song with series
		song.forEach((val, i) => (attr_series ? val[song_idx.attr] & attr_series : val[song_idx.reading].includes(search_value)) ? hits.push(i) : null);
	} else {			// get song by search
		const max_hit = 200;
		for (var i = 1; i < song.length && hits.length < max_hit; ++i) {
			if (setting.search_by_song ? 
				processed_song_name[i].includes(search_value) ||
				song[i][song_idx.reading].toLowerCase().includes(search_value) :
				song[i][song_idx.artist].toLowerCase().includes(search_value)
			) {
				// put in front if song name is exactly the same as searched value
				processed_song_name[i] === search_value ? hits.unshift(i) : hits.push(i);
			}
		}
	}
	update_display();
}

function update_display(force = false) {
	// ignore blank input if search from rep
	force |= is_searching_from_rep;
	
	$("#search_auto").addClass("hidden");
	if (!loading && !force) {
		return;
	}
	let current_song = -1;
	// record loaded song (for un-hiding song thats no longer loaded)
	let loaded_song = [];
	let displayed = found_entries = 0;
	let new_html = "";
	for (let i = 0; i < hits.length; ++i) {
		// sort according to settings
		let sorted_enrties = [];
		if (setting.search_sort_by_date) {
			sorted_enrties = entry_proc[hits[i]].sort((a, b) => {
				return (setting.search_sort_asd ? a - b : b - a);
			});
		} else {
			sorted_enrties = entry_proc[hits[i]].sort((a, b) => {
				if (entry[a][entry_idx.type] === entry[b][entry_idx.type]) {
					return a - b;
				}
				return (setting.search_sort_asd ? 1 : -1) * (display_order[entry[a][entry_idx.type]] - display_order[entry[b][entry_idx.type]])
			});
		}
		found_entries += sorted_enrties.length;
		for (let j = 0; j < sorted_enrties.length; ++j) {
			let cur_entry = sorted_enrties[j];
			// get part filter
			let no_selected_found = !part_filter.some((val, i) => (val && (part_rom[i] & entry[cur_entry][entry_idx.type])));
			// if hit on previous module or private
			if (no_selected_found || ((!setting.show_hidden) && is_private(cur_entry))) {
				continue;
			}
			// if new song
			if (current_song !== hits[i]) {
				new_html += ((current_song !== -1 ? "</div>" : "") + `<div class="song_container">`);
				current_song = hits[i];
				loaded_song.push(current_song);
				// if hide the song
				let show = !hide_song.includes(current_song);
				// check song name
				let song_name = song[current_song][song_idx.name].normalize("NFKC");
				let song_name_length = 0;
				for (let k = 0; k < song_name.length; ++k) {
					song_name_length += /[ -~]/.test(song_name.charAt(k)) ? 1 : 2;
				}
				// you know what fuck this shit i will just add exception
				if (["secret base ~君がくれたもの~",
					 "かくしん的☆めたまるふぉ～ぜっ！",
					 "ススメ☆オトメ ~jewel parade~",
					 "Time after time ～花舞う街で～"
					].includes(song_name)
				) {
					song_name_length = 0;
				}
				// case "みくみくにしてあげる♪【してやんよ】"
				if (song_name === "みくみくにしてあげる♪【してやんよ】") {
					song_name = "みくみくにしてあげる♪<br />【してやんよ】";
				}
				if (/([^~]+~+[^~])/g.test(song_name) && song_name_length >= 28) {
					song_name = song_name.substring(0, song_name.search(/~/g)) + "<br />" + song_name.substring(song_name.search(/~/g));
				}
				new_html += `<div class="song_name_container" id="${current_song}"><div class="song_rap"><div class="song_name">${song_name}</div><div class="song_credit${show ? "" : " hidden"}${song[current_song][song_idx.artist].length > 30 ? " long_credit" : ""} song_${current_song}">${song[current_song][song_idx.artist]}</div></div><div class="song_icon_container"><div id="fold_${current_song}" class="song_fold_icon${show ? "" : " closed"}"></div><div id="copy_name_${current_song}" class="song_copy_icon song_${current_song}${show ? "" : " hidden"}"></div></div></div>`;
			}
			var note = entry[cur_entry][entry_idx.note];
			const is_mem = note.includes("【メン限");
			if (is_mem) {
				note = note.replace(/【メン限アーカイブ】|【メン限】/g, "");
			}
			new_html += `<div class="entry_container singer_${entry[cur_entry][entry_idx.type]}${is_mem ? "m" : ""} song_${current_song}${hide_song.includes(current_song) ? " hidden" : ""}"><a href="https://youtu.be/${video[entry[cur_entry][entry_idx.video]][video_idx.id]}${timestamp(cur_entry)}" target="_blank"><div class="entry_primary"><div class="entry_date">${display_date(video[entry[cur_entry][entry_idx.video]][video_idx.date])}</div><div class="entry_singer">${singer_lookup[entry[cur_entry][entry_idx.type]]}</div><div class="mem_display">${is_mem ? "メン限" : ""}</div><div class="entry_share" id="entry_${cur_entry}"></div></div>${note ? `<div class="entry_note">${note}</div>` : ""}</a></div>`;
			if (++displayed >= 400) {	// hardcoded max_display
				i = 200;
				break;
			}
		}
	}
	// dealing with a blank screen with non-blank input
	// no song found
	if (!hits.length) {
		new_html += `<div class="search_no_result">曲検索結果なし`;
	}
	// only never sang songs are found
	else if (!found_entries) {
		new_html += `<div class="search_no_result">歌記録なし`;
	}
	// only private songs are found / singer deselected
	else if (new_html === "") {
		new_html += `<div class="search_no_result">非表示動画のみ`;
	}
	
	$("#search_display").html(new_html + `</div><div class="general_vertical_space"></div>`);
	// check all hiden songs
	for (let i = 0; i < hide_song.length; ++i) {
		// if song havnt been loaded, remove from hide list
		if (!loaded_song.includes(hide_song[i])) {
			hide_song.splice(i--, 1);
		}
	}
}

function timestamp(id) {
	let e = entry[id][entry_idx.time];
	return e ? "?t=" + e : "";
}
