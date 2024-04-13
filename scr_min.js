const singer_lookup=[,"看谷にぃあ","胡桃澤もも","ももにぃあ","逢魔きらら","きらにぃあ","ももきら","ぷちここ","つきみゆこ",,"ゆこもも",,"ゆこきら",,,,"愛白ふりる",,,,,,,,,,,,,,,,"小悪熊ちゅい"],display_order=[,7,6,4,5,3,2,1,12,,9,,8,,,,11,,,,,,,,,,,,,,,,10];let member_display_order=[7,6,5,3,4,2,1];const series_lookup={"マクロス":"マクロスまくろす","ラブライブ":"ラブライブらぶらいぶll","アイマス":"アイマスあいますデレマスでれます","ジブリ":"ジブリじぶり","物語シリーズ":"物語シリーズものがたりしりーず","まどマギ":"まどマギまどまぎ",disney:"disneyディズニーでぃずにー"},entry_idx={song_id:0,video:1,note:2,time:3,type:4},song_idx={name:0,artist:1,reading:2,attr:3,release:4,reference:5},video_idx={id:0,date:1};let video,entry;const version="1.7.5",key_hash=["473c05c1ae8349a187d233a02c514ac73fe08ff4418429806a49f7b2fe4ba0b7a36ba95df1d58b8e84a602258af69194","3f01e53f1bcee58f6fb472b5d2cf8e00ce673b13599791d8d2d4ddcde3defbbb4e0ab7bc704538080d704d87d79d0410"];let __TEST__=[],prevent_menu_popup=!1,current_page="home",key_valid=0,setting={show_hidden:!0,select_input:!0,changeless_auto:!1,show_random:!1,random_ignore:!0,search_by_song:!0,search_sort_by_date:!0,search_sort_asd:!0,show_release:!1,longPress_copy:!0,rep_select_input:!0,rep_sort:"50",rep_sort_asd:!0,rep_selected_first:!1,rep_show_artist:!0,longPress_time:600},entry_proc=[],memcount_rep_int,processed_song_name=[""],auto_skips=[];{let e=ls("theme");e||(e="mixed",ls("theme",e)),document.documentElement.setAttribute("theme",e)}document.addEventListener("DOMContentLoaded",async function(){if(window.innerHeight/window.innerWidth<1.5){$("#v_screen").addClass("post_switch"),$("#v_screen").height("100%"),$("#v_screen").width(.5625*window.innerHeight),$("#v_screen").attr("src","index.html"+window.location.search),$("body > div").addClass("post_switch"),$("body").addClass("post_switch");let e=new URLSearchParams(window.location.search);e.delete("key"),window.history.pushState(null,null,`${document.location.href.split("?")[0]}${e.size?`?${e}`:""}`),song=song_lookup=note_index=null;return}let e;function n(n){return t?CryptoJS.AES.decrypt(n,e).toString(CryptoJS.enc.Utf8):n}$(`#three_way_${ls("theme")==="extra"?"dark":ls("theme")}`).addClass("selected");let o=new URLSearchParams(window.location.search);e=o.get("key");let s=!0,t=0;await getSHA384Hash(ls("pcsl_key"))===key_hash[1]?(t=2,e=ls("pcsl_key")):e!==""&&await getSHA384Hash(e)===key_hash[1]?(t=2,s=!1,ls("pcsl_key",e)):await getSHA384Hash(ls("pcsl_key"))===key_hash[0]?(t=1,e=ls("pcsl_key")):e!==""&&await getSHA384Hash(e)===key_hash[0]&&(t=1,s=!1,ls("pcsl_key",e)),key_valid=t?1:0;let i=ls("pcsl_version_hash");if(i===version_hash&&s){let e=ls("pcsl_data").split(`
`);video=JSON.parse(n(e[0])),entry=JSON.parse(n(e[1])),process_data()}else $("#loading_text").html("Downloading data..."),fetch(`data_${t}.txt`).then(e=>(e.ok||(console.log(`failed to load data_${t}.txt`),$("#loading_text").html("Failed to download data.<br />Please reload to try again.<br /><br />Contact site administrator<br />if this problem persists.")),e.text())).then(e=>{const t=e.split(`
`);video=JSON.parse(n(t[0])),entry=JSON.parse(n(t[1])),ls("pcsl_data",e),ls("pcsl_version_hash",version_hash),process_data()});key_valid?(member_display_order=[7,6,5,3,4,2,1,32,16,8],$(".extra").removeClass("hidden"),$(".memcount_subblock").removeClass("anti_extra"),$(".anti_extra").html(""),$(".anti_extra").addClass("hidden"),$("#home_key").removeClass("hidden"),$("#filter_entry_icon_container").addClass("hidden"),$("#filter_entry_icon_extra").removeClass("hidden")):part_filter=[1,1,1,0,0,0]});function process_data(){$("#loading_text").html("Processing data...");let e=new URLSearchParams(window.location.search);e.delete("key"),window.history.pushState(null,null,`${document.location.href.split("?")[0]}${e.size?`?${e}`:""}`);const t=[["pcsl_s_showHidden",1],["pcsl_s_selecInput",1],["pcsl_s_autoAnyway",0],["pcsl_s_showRandom",0],["pcsl_s_ignoreRule",0],["pcsl_s_rep_select",1],["pcsl_s_showReleas",0],["pcsl_s_LPressCopy",1],["pcsl_s_longP_time",600]];for(let e in t)ls(t[e][0])===null&&ls(t[e][0],t[e][1]);switch(setting.show_hidden=ls("pcsl_s_showHidden")==1,setting.select_input=ls("pcsl_s_selecInput")==1,setting.changeless_auto=ls("pcsl_s_autoAnyway")==1,setting.show_random=ls("pcsl_s_showRandom")==1,setting.random_ignore=ls("pcsl_s_ignoreRule")==1,setting.rep_select_input=ls("pcsl_s_rep_select")==1,setting.show_release=ls("pcsl_s_showReleas")==1,setting.longPress_copy=ls("pcsl_s_LPressCopy")==1,setting.rep_show_artist=ls("pcsl_s_rep_artist")==1,setting.longPress_time=parseInt(ls("pcsl_s_longP_time")),setting.show_hidden||$("#setting_hidden>div").toggleClass("selected"),setting.select_input||$("#setting_select>div").toggleClass("selected"),setting.changeless_auto&&$("#setting_auto>div").toggleClass("selected"),setting.show_random&&$("#setting_random>div").toggleClass("selected"),setting.random_ignore&&$("#setting_ignore>div").toggleClass("selected"),setting.rep_select_input||$("#setting_rep_select>div").toggleClass("selected"),setting.show_release&&$("#setting_release>div").toggleClass("selected"),setting.longPress_copy||$("#setting_copy>div").toggleClass("selected"),setting.rep_show_artist||$(".rep_tweet_a").toggleClass("selected"),$("#three_way_time>div").removeClass("selected"),$(`#three_way_${setting.longPress_time}`).addClass("selected"),$("#nav_search_random").toggleClass("blank",!setting.show_random),$(".setting_req_random").toggleClass("disabled",!setting.show_random),$(".setting_copy_time").toggleClass("disabled",!setting.longPress_copy),ls("pcsl_s_show_extra")&&$("#setting_extra_container").removeClass("hidden"),ls("theme")){case"light":case"mixed":$("#setting_extra_container>div").addClass("disabled");break;case"extra":$("#setting_extra").click()}if(init(),e.get("sfilter")!==null){let t=parseInt(e.get("sfilter"));const n=[t&1?"":"nia",t&2?"":"momo",t&4?"":"kirara",t&8?"":"yuco",t&16?"":"shiro",t&32?"":"chui"];if(e.get("page")===("rep"||"repertoire")||e.get("rfilter")!==null)for(let e in n){if(n[e]==="")continue;$(`.filter_icon${key_valid?"_extra":""}.icon_`+n[e]).click()}if(e.get("page")==="search"||e.get("search")!==null)for(let e in n)n[e].length&&$(".singer_icon.icon_"+n[e]).click()}let n=e.get("page");if(n!=="home"&&jump2page(n)===-1&&jump2page("home"),e.get("search")!==null){current_page!=="search"&&jump2page("search");let t=e.get("search").split(",");if(t.length>1){let e=0;for(let s in t){let n=parseInt(t[s]);n>=1&&n<song.length&&(hits[e++]=song_lookup[n])}is_searching_from_rep=1,search_memory="!bulk_load_flag",update_display(1)}else t>=1&&t<song.length&&($("#input").val(song[song_lookup[t]][song_idx.name]),$("#input").blur())}if(e.get("rfilter")!==null){current_page!=="repertoire"&&jump2page("rep");let t=[],n=parseInt(e.get("rfilter")),s=0;for(;n;)n%2&&t.push(s),n>>=1,s++;for(let e in rep_anisong)t.includes(rep_anisong[e][1])||$("#anisong_"+e).click();for(let e in rep_genre)t.includes(rep_genre[e][1])||$("#general_"+e).click()}$("#loading_text").html("Loading Complete.<br />You can't see this tho"),$("#loading_overlay").addClass("hidden"),$("body").removeClass("allow_reload")}$(function(){$(document).on("click","#nav_menu",function(e){if(e.preventDefault(),prevent_menu_popup)return;$("#menu_container").toggleClass("hidden"),$("#nav_menu").toggleClass("menu_opened"),$(document.body).toggleClass("no_scroll")}),$(document).on("click","#nav_to_top",function(e){if(e.preventDefault(),prevent_menu_popup)return;let t=$("html,body").scrollTop(),n=t/33;function s(){t-=n,$("html,body").scrollTop(t),t<=0&&clearInterval(o)}let o=setInterval(s,1);current_page==="repertoire"&&setting.rep_selected_first&&rep_display()}),$(document).on("click","#menu_container",function(e){$(e.target).parents(".defog").length||$(e.target).hasClass("defog")||($("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),$(document.body).removeClass("no_scroll"))}),$(document).on("click",".menu2page",function(e){let t=$(e.target).attr("id").replace("menu2page_","");if(t===current_page)return;jump2page(t),$("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),$(document.body).removeClass("no_scroll")}),$(document).on("click","#menu_setting",function(){$("#popup_container").removeClass("hidden"),$("#settings").removeClass("hidden"),$("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),prevent_menu_popup=!0}),$(document).on("click","#menu_count",function(){if($("#popup_container").removeClass("hidden"),$("#memcount").removeClass("hidden"),$("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),prevent_menu_popup=!0,$("#memcount_content").html()!=="")return;let t=[];for(let e=0;e<33;++e)t[e]=[0,0,0];for(let e=0;e<entry.length;++e){if(is_private(e)){t[entry[e][entry_idx.type]][2]++;continue}if(entry[e][entry_idx.note].includes("【メン限")){t[entry[e][entry_idx.type]][1]++;continue}t[entry[e][entry_idx.type]][0]++}let e=`<table id="memcount_table"><tr><th></th><th>通常</th><th>メン限</th><th>非公開</th></tr>`;for(let s in member_display_order){let n=member_display_order[s];e+=`<tr class="memcount_row"><td class="memcount_name singer_${n}"><div>${singer_lookup[n]}</div></td>`;for(let s=0;s<3;++s)e+=`<td class="${t[n][s]===0?"memcount_empty":`singer_${n}`}">${t[n][s]}</td>`;e+="</tr>"}let n=[0,0,0,0,0,0];for(let t in entry){let e=split_to_solo(entry[t][entry_idx.type]);for(let t in e)n[part_rom.indexOf(e[t])]++}if(key_valid){e+=`</table><div id="memcount_sum_warpper" class="memcount_sum"><div class="memcount_sum_icon col-1 colspan-2"></div>`;for(let t=0;t<2;++t){for(let s=2;s>=0;--s)e+=`<div class="singer_${1<<t*3+s}">${n[t*3+s]}</div>`;e+="<div></div>"}}else{e+=`</table><div class="memcount_sum"><div class="memcount_sum_icon"></div>`;for(let t=2;t>=0;--t)e+=`<div class="singer_${1<<t}">${n[t]}</div>`}$("#memcount_content").html(e+"</div>"),memcount_rep_int=setInterval(memcount_load_rep,1)}),$(document).on("click","#menu_info",function(){$("#popup_container").removeClass("hidden"),$("#information").removeClass("hidden"),$("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),prevent_menu_popup=!0});{let e=0;$(document).on("click","#three_way_theme>div",function(){let t=this.id.replace("three_way_","");$("#setting_extra_container>div").toggleClass("disabled",t!=="dark"),t==="dark"&&(t=$("#dark_extra").hasClass("selected")?"extra":"dark"),document.documentElement.setAttribute("theme",t),ls("theme",t),$("#three_way_theme>div").removeClass("selected"),$(this).addClass("selected"),parent.refresh_bgColour(),e=t==="dark"?++e:0,e===5&&($("#setting_extra_container").removeClass("hidden"),ls("pcsl_s_show_extra",1))}),$(document).on("click","#three_way_time>div",function(){let e=parseInt(this.id.replace("three_way_",""));ls("pcsl_s_longP_time",e),setting.longPress_time=e,$("#three_way_time>div").removeClass("selected"),$(this).addClass("selected")}),$(document).on("click",".two_way:not(.disabled)",function(){switch($(this).children().toggleClass("selected"),this.id){case"setting_extra":let e=$("#dark_extra").hasClass("selected");ls("theme",e?"extra":"dark"),document.documentElement.setAttribute("theme",ls("theme"));break;case"setting_hidden":setting.show_hidden^=1,ls("pcsl_s_showHidden",setting.show_hidden?"1":"0"),update_display(1);break;case"setting_select":setting.select_input^=1,ls("pcsl_s_selecInput",setting.select_input?"1":"0");break;case"setting_auto":setting.changeless_auto^=1,ls("pcsl_s_autoAnyway",setting.changeless_auto?"1":"0");break;case"setting_random":setting.show_random^=1,$("#nav_search_random").toggleClass("blank",setting.show_random),ls("pcsl_s_showRandom",setting.show_random?"1":"0"),$(".setting_req_random").toggleClass("disabled",!setting.show_random);break;case"setting_ignore":setting.random_ignore^=1,$("#nav_search_random").toggleClass("disabled",!setting.search_by_song||!setting.random_ignore&&search_memory!==""),ls("pcsl_s_ignoreRule",setting.random_ignore?"1":"0");break;case"setting_release":setting.show_release^=1,ls("pcsl_s_showReleas",setting.show_release?"1":"0"),current_page==="repertoire"&&rep_display();break;case"setting_rep_select":setting.rep_select_input^=1,ls("pcsl_s_rep_select",setting.rep_select_input?"1":"0");break;case"setting_copy":setting.longPress_copy^=1,ls("pcsl_s_LPressCopy",setting.longPress_copy?"1":"0"),$(".setting_copy_time").toggleClass("disabled",!setting.longPress_copy)}})}$(document).on("click","#memcount, #memcount_rep",function(e){$(e.target).closest(".popup_frame").length&&$(".memcount_subblock").toggleClass("hidden")}),$(document).on("click","#popup_container",function(e){$(e.target).closest(".popup_frame").length||($(".popup_frame").addClass("hidden"),$("#popup_container").addClass("hidden"),$(document.body).removeClass("no_scroll"),prevent_menu_popup=!1)}),$(document).on("click","#home_key_reset",function(){$("#popup_container").removeClass("hidden"),$("#remove_key").removeClass("hidden"),$("#menu_container").addClass("hidden"),$("#nav_menu").removeClass("menu_opened"),$(document.body).addClass("no_scroll"),prevent_menu_popup=!0}),$(document).on("click","#remove_key_yes",function(){ls("pcsl_version_hash",""),ls("pcsl_key",""),window.location=window.location.href.split("?")[0]}),$(document).on("click","#remove_key_nah",function(){$("#remove_key").addClass("hidden"),$("#popup_container").addClass("hidden"),$(document.body).removeClass("no_scroll"),prevent_menu_popup=!1})});function init(){$("#input").val("");{const e=new Date("2021-01-01");function t(t){let n=new Date(e);return n.setDate(e.getDate()+t),n.toISOString().slice(0,10)}for(let e in video)video[e][video_idx.date]=t(video[e][video_idx.date]);for(let e in entry)entry[e][entry_idx.note]=note_index[entry[e][entry_idx.note]];note_index=null}for(let e in song)entry_proc[e]=[];for(let e=0;e<entry.length;++e)entry[e][entry_idx.type]&&entry_proc[entry[e][0]].push(e);$("#info_version").html(version),$("#info_last-update").html(video[video.length-1][video_idx.date]),auto_display_max=Math.floor(7*window.innerHeight/window.innerWidth);let e=[];for(let e=1;e<song.length;++e)processed_song_name.push(song[e][song_idx.name].toLowerCase().normalize("NFKC")),e>2&&song[e][song_idx.name].trim()===song[e-1][song_idx.name].trim()&&auto_skips.push(e);for(let t=0;t<song.length;++t){rep_list[t]=0;for(let e in entry_proc[t])rep_list[t]|=entry[entry_proc[t][e]][entry_idx.type];e[t]=[...new Set(entry_proc[t])],rep_hits_solo[t]=[];for(let n in e[t])rep_hits_solo[t]=rep_hits_solo[t].concat(split_to_solo(entry[e[t][n]][entry_idx.type]));rep_hits_solo[t]=[...new Set(rep_hits_solo[t])].filter(Number)}}function memcount_load_rep(){clearInterval(memcount_rep_int);let e=[];for(let t=0;t<33;++t)e[t]=[];for(let t in rep_hits_solo)for(let s in rep_hits_solo[t]){let n=split_to_solo(rep_hits_solo[t][s]);for(let s in n)e[n[s]].push(t)}e.map(e=>[...new Set(e)]),__TEST__=e;let s=[e[4].length,e[2].length,e[1].length,e[32].length,e[16].length,e[8].length,new Set([...e[4],...e[32]]).size,new Set([...e[2],...e[16]]).size,new Set([...e[1],...e[8]]).size],t=[4,2,1,32,16,8,4,2,1],n="";for(let e=0;e<(key_valid?6:3);++e)n+=`<div class="memcount_rep_block"><div class="singer_${t[e]}m memcount_rep_name">${singer_lookup[t[e]]}</div><div class="singer_${t[e]}">${s[e]}</div></div>`;if(key_valid){n+=`<div></div><div class="memcount_rep_sum"></div><div></div>`;for(let e=6;e<9;++e)n+=`<div class="memcount_rep_block_sum memcount_rep_singer_${t[e]}"><div>${s[e]}</div></div>`}$("#memcount_rep_content").toggleClass("extra_content",key_valid===1),$("#memcount_rep_content").html(n)}function display_date(e){let t=typeof e=="string"?new Date(e):e;return t.getFullYear()+"-"+fill_digit(t.getMonth()+1,2)+"-"+fill_digit(t.getDate(),2)}function fill_digit(e,t){let n=""+e;for(;n.length<t;)n="0"+n;return n}function is_private(e){return entry[e][entry_idx.note].includes("非公開")||entry[e][entry_idx.note].includes("記録用")||entry[e][entry_idx.note].includes("アーカイブなし")}function bold(e,t){let n=e.toLowerCase().indexOf(t.toLowerCase());return n===-1||t===""?e:e.substring(0,n)+"<b>"+e.substring(n,n+t.length)+"</b>"+e.substring(n+t.length)}function copy_of(e){return typeof e=="object"?JSON.parse(JSON.stringify(e)):e}function get_last_sang(e,t=[4,2,1,32,16,8]){for(let n=entry_proc[e].length-1;n>=0;--n)if(t.some(t=>(t&entry[entry_proc[e][n]][entry_idx.type])===t))return new Date(video[entry[entry_proc[e][n]][entry_idx.video]][video_idx.date]);return 0}function to8601(e){try{return new Date(e.substring(6),parseInt(e.substring(3,5))-1,e.substring(0,2))}catch{return console.log(e+" is not in dd-MM-yyyy format"),-1}}const today=(new Date).setHours(0,0,0,0);function get_date_different(e,t=today){return e=typeof e=="string"?new Date(e):e,t=t===void 0?t:new Date(t),Math.round(Math.abs(e-t)/864e5)}function get_sang_count(e,t=[4,2,1,32,16,8]){let n=mem_count=0;for(let s in entry_proc[e])t.some(t=>(t&entry[entry_proc[e][s]][entry_idx.type])===t)&&(n++,entry[entry_proc[e][s]][entry_idx.note].includes("【メン限")&&mem_count++);return[n,mem_count]}function jump2page(e){switch(e=e==="rep"?"repertoire":e,current_page=e,$(".menu2page_selected").removeClass("menu2page_selected"),$("#menu2page_"+e).addClass("menu2page_selected"),$(".section_container").addClass("hidden"),$("#"+e+"_section").removeClass("hidden"),$("#nav_dummy").addClass("hidden"),$("#nav_search_random").addClass("hidden"),$("#nav_bulk_search").addClass("hidden"),$("#nav_share").addClass("hidden"),$("#search_display").html(""),$("#rep_display").html(""),e){case"home":$("#nav_title").html("ホーム"),$("#nav_dummy").removeClass("hidden");break;case"search":$("#nav_search_random").removeClass("hidden"),$("#nav_title").html("曲検索"),$("#input").val(""),search();break;case"repertoire":$("#repertoire_section").removeClass("hidden"),$("#nav_share").removeClass("hidden"),$("#nav_share").toggleClass("disabled",!rep_selected.length),$("#nav_title").html("レパートリー"),rep_input_memory="",rep_search();break;default:return-1}$(window).scrollTop(0)}function split_to_solo(e){switch(e){case 3:return[1,2];case 5:return[1,4];case 6:return[2,4];case 7:return[1,2,4];case 10:return[2,8];case 12:return[4,8]}return[e]}let copy_popup_flag=!1;function copy_popup(){if(copy_popup_flag)return;copy_popup_flag=!0,$("#copy_popup").attr("class","fade_out"),setTimeout(()=>{copy_popup_flag=!1,$("#copy_popup").attr("class","hidden")},1500)}function to_html(e){return e.replaceAll(`"`,`&quot;`).replaceAll(`'`,`&apos;`)}function to_non_html(e){return e.replaceAll(`&quot;`,`"`).replaceAll(`&apos;`,`'`)}const getSHA384Hash=async e=>{const t=(new TextEncoder).encode(e),n=await window.crypto.subtle.digest("SHA-384",t),s=Array.from(new Uint8Array(n)),o=s.map(e=>e.toString(16).padStart(2,"0")).join("");return o};function refresh_bgColour(){document.documentElement.setAttribute("theme",ls("theme"))}function ls(e,t){return t===void 0?localStorage.getItem(e):localStorage.setItem(e,t)}let search_memory="",part_filter=[1,1,1,1,1,1];const part_rom=[1,2,4,8,16,32];let hide_song=new Array,auto_display_max,auto_display_count,is_searching_from_rep=!1,input_focused=!1;$(function(){let e;$(document).on("click","#nav_search_random",function(){if($(this).hasClass("disabled")&&!setting.random_ignore||prevent_menu_popup)return;let n=0;if(part_filter.forEach((e,t)=>e?n+=part_rom[t]:null),!n)return;let t;for(;1;){if(t=1+Math.floor(Math.random()*song.length),t===e)continue;if(rep_list[t]&n&&(setting.show_hidden||entry_proc[t].some(e=>entry[e][entry_idx.type]&n&&!is_private(e))))break}e=t,$("#search_input").val(song[t][song_idx.name]),is_searching_from_rep=0,search()});{$(document).on("input","#search_input",function(){auto_search()}),$(document).on("mousedown",".auto_panel",function(){$("#search_input").val(to_non_html(this.id))});let e=0;$(document).on("keydown",function(t){let n=Object({38:-1,40:1})[t.keyCode];if($("#search_auto").hasClass("hidden")||n===void 0||auto_input_memory!==get_search_input()||!e&&n===-1)return;e=Math.max(1,Math.min(auto_display_max,auto_display_count,e+n)),$("#search_auto>div").removeClass("selected"),$(`#search_auto>div:nth-child(${e})`).addClass("selected")}),$(document).on("blur","#search_input",function(){$("#search_auto").addClass("hidden"),input_focused=!1,is_searching_from_rep?is_searching_from_rep=0:$("#nav_share").toggleClass("disabled",!is_searching_from_rep),search()}),$(document).on("keydown",function(t){t.keyCode===13&&current_page==="search"&&(e&&(e=0,$("#search_input").val($(".auto_panel.selected")[0].id)),$("#search_input").blur())}),$(document).on("click","#search_input, #rep_input",function(){if(input_focused)return;if(input_focused=!0,setting.select_input&&this.id==="input"||setting.rep_select_input&&this.id==="rep_input"){let e=this;setTimeout(function(){e.setSelectionRange(0,$(e).val().length)},0)}else search_memory==="!bulk_load_flag"&&this.id==="input"&&($(this).val(""),$("#nav_search_random").removeClass("disabled"),$("#nav_share").addClass("disabled"));this.id==="input"&&auto_search()}),$(document).on("click","#ser_opt_button",function(){$(this).toggleClass("opened"),$("#ser_opt_container").toggleClass("hidden")}),$(document).on("click",".singer_icon",function(){part_filter[part_rom.indexOf(parseInt($(this).attr("name")))]^=1,$(this).toggleClass("selected"),search_memory="",search()}),$(document).on("click",".ser_opt_gp1",function(){let e=this.id==="ser_opt_songname";if(e===setting.search_by_song)return;setting.search_by_song=e,$(".ser_opt_gp1>.radio").toggleClass("selected"),$("#search_input").val(""),$("#search_input").attr("placeholder",setting.search_by_song?"曲名/読みで検索":"アーティスト名で検索"),$("#search_display").html(""),search_memory="",$("#nav_search_random").toggleClass("disabled",!setting.search_by_song)});function t(){$("#ser_opt_asd>.attr_name").html(new Array("古い順&nbsp;(⇌新しい順)","新しい順&nbsp;(⇌古い順)","正順&nbsp;(⇌逆順)","逆順&nbsp;(⇌正順)")[(setting.search_sort_by_date?0:2)+(setting.search_sort_asd?0:1)])}$(document).on("click",".ser_opt_gp2",function(){let e=this.id==="ser_opt_date";if(e===setting.search_sort_by_date)return;setting.search_sort_by_date=e,$(".ser_opt_gp2>.radio").toggleClass("selected"),t(),update_display()}),$(document).on("click","#ser_opt_asd",function(){setting.search_sort_asd^=1,t(),update_display()}),$(document).on("click",".song_name_container",function(e){if($(e.target).hasClass("song_copy_icon"))return;let t=this.id;hide_song.includes(t)?hide_song.splice(hide_song.indexOf(t),1):hide_song.push(t),$(".song_"+t).toggleClass("hidden"),$("#fold_"+t).toggleClass("closed")}),$(document).on("click",".song_copy_icon",function(){navigator.clipboard.writeText(song[parseInt(this.id.replace("copy_name_",""))][song_idx.name]),copy_popup()}),$(document).on("click",".entry_share",function(e){e.preventDefault();let t=parseInt(this.id.replace("entry_",""));const n="https://www.youtube.com/watch?v="+video[entry[t][entry_idx.video]][video_idx.id];fetch("https://noembed.com/embed?dataType=json&url="+n).then(e=>e.json()).then(function(e){if(!e.title){alert("動画タイトル取得できませんでした。");return}let n;entry[t][entry_idx.time]?n=song[entry[t][entry_idx.song_id]][song_idx.name].trim()+" / "+song[entry[t][entry_idx.song_id]][song_idx.artist]+" @"+e.title+`
(youtu.be/`+video[entry[t][entry_idx.video]][video_idx.id]+timestamp(t)+")":n=e.title+`
(youtu.be/`+video[entry[t][entry_idx.video]][video_idx.id]+")",window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(n),"_blank")})})}});let hits=[],auto_input_memory="";function auto_search(){let e=get_search_input();if(auto_input_memory===e&&!setting.changeless_auto)return;if(auto_input_memory=e,!e||!setting.search_by_song){$("#search_auto").addClass("hidden");return}let t=[],n=[];function o(e,s){s?s>0&&n.push(e):t.push(e)}for(let n in series_lookup)series_lookup[n].includes(e)&&t.push(n);const i=/[^\u3040-\u309F\u30FC\u30F4]/.test(e);for(let n=1;n<song.length&&t.length<auto_display_max;++n){if(auto_skips.includes(n))continue;if(i){let t=processed_song_name[n].indexOf(e);t===-1&&song[n][song_idx.reading].includes(" ")&&song[n][song_idx.reading].includes(e)&&(t=1),o(n,t)}else o(n,song[n][song_idx.reading].indexOf(e))}auto_display_count=0;let s="";for(let n in t){let o=auto_display=song_name="";typeof t[n]=="string"?auto_display=song_name=t[n]:(o=bold(song[t[n]][song_idx.reading].split(" ")[0],e),song_name=song[t[n]][song_idx.name],auto_display=bold(song_name,e)),s+=`<div id="${to_html(song_name)}" class="auto_panel${auto_display_count++===0?" auto_first":""}"><div class="auto_reading">${o}</div><div class="auto_display">${auto_display}</div></div>`}for(let t in n){if(auto_display_count++>=auto_display_max)break;s+=`<div id="${to_html(song[n[t]][song_idx.name])}" class="auto_panel${auto_display_count===0?" auto_first":""}"><div class="auto_reading"></div><div class="auto_display">${bold(song[n[t]][song_idx.name],e)}</div></div>`}$("#search_auto").html(s),$("#search_auto").toggleClass("hidden",!s),auto_pointer=0,$("#search_auto>div").removeClass("selected")}function search(){if(is_searching_from_rep){update_display();return}let e=get_search_input();if(e===search_memory)return;if(search_memory=e,!e){$("#search_display").html(""),$("#nav_search_random").removeClass("disabled");return}$("#nav_search_random").toggleClass("disabled",!setting.random_ignore);const s=e in series_lookup?e:"",n=attr_idx.includes(e)?attr_idx.indexOf(e):0;if(hits=[],s)song.forEach((t,s)=>s?(n?t[song_idx.attr]&1<<n:t[song_idx.reading].includes(e))?hits.push(s):null:null);else{const n=200;for(var t=1;t<song.length&&hits.length<n;++t)(setting.search_by_song?processed_song_name[t].includes(e)||song[t][song_idx.reading].toLowerCase().includes(e):song[t][song_idx.artist].toLowerCase().includes(e))&&(processed_song_name[t]===e?hits.unshift(t):hits.push(t))}update_display()}function update_display(e=!1){if(e|=is_searching_from_rep,$("#search_auto").addClass("hidden"),!search_memory&&!e)return;let t=-1,s=[],o=found_entries=0,n="";for(let e=0;e<hits.length&&e<=200;++e){let i=[];setting.search_sort_by_date?i=entry_proc[hits[e]].sort((e,t)=>setting.search_sort_asd?e-t:t-e):i=entry_proc[hits[e]].sort((e,t)=>entry[e][entry_idx.type]===entry[t][entry_idx.type]?e-t:(setting.search_sort_asd?1:-1)*(display_order[entry[e][entry_idx.type]]-display_order[entry[t][entry_idx.type]])),found_entries+=i.length;for(let c=0;c<i.length;++c){let a=i[c],d=!part_filter.some((e,t)=>e&&part_rom[t]&entry[a][entry_idx.type]);if(d||!setting.show_hidden&&is_private(a))continue;if(t!==hits[e]){n+=(t!==-1?"</div>":"")+`<div class="song_container">`,t=hits[e],s.push(t);let i=!hide_song.includes(t),o=song[t][song_idx.name].normalize("NFKC"),a=0;for(let e=0;e<o.length;++e)a+=/[ -~]/.test(o.charAt(e))?1:2;["secret base ~君がくれたもの~","かくしん的☆めたまるふぉ～ぜっ！","ススメ☆オトメ ~jewel parade~","Time after time ～花舞う街で～"].includes(o)&&(a=0),o==="みくみくにしてあげる♪【してやんよ】"&&(o="みくみくにしてあげる♪<br />【してやんよ】"),/([^~]+~+[^~])/g.test(o)&&a>=28&&(o=o.substring(0,o.search(/~/g))+"<br />"+o.substring(o.search(/~/g))),n+=`<div class="song_name_container" id="${t}"><div class="song_rap"><div class="song_name">${o}</div><div class="song_credit${i?"":" hidden"}${song[t][song_idx.artist].length>30?" long_credit":""} song_${t}">${song[t][song_idx.artist]}</div></div><div class="song_icon_container"><div id="fold_${t}" class="song_fold_icon${i?"":" closed"}"></div><div id="copy_name_${t}" class="song_copy_icon song_${t}${i?"":" hidden"}"></div></div></div>`}let r=entry[a][entry_idx.note];const l=r.includes("【メン限");if(l&&(r=r.replace(/【メン限アーカイブ】|【メン限】/g,"")),n+=`<div class="entry_container singer_${entry[a][entry_idx.type]}${l?"m":""} song_${t}${hide_song.includes(t)?" hidden":""}"><a href="https://youtu.be/${video[entry[a][entry_idx.video]][video_idx.id]}${timestamp(a)}" target="_blank"><div class="entry_primary"><div class="entry_date">${display_date(video[entry[a][entry_idx.video]][video_idx.date])}</div><div class="entry_singer">${singer_lookup[entry[a][entry_idx.type]]}</div><div class="mem_display">${l?"メン限":""}</div><div class="entry_share" id="entry_${a}"></div></div>${r?`<div class="entry_note">${r}</div>`:""}</a></div>`,++o>=400){e=200;break}}}hits.length?found_entries?n===""&&(n+=`<div class="search_no_result">非表示動画のみ`):n+=`<div class="search_no_result">歌記録なし`:n+=`<div class="search_no_result">曲検索結果なし`,$("#search_display").html(n+`</div><div class="general_vertical_space"></div>`);for(let e=0;e<hide_song.length;++e)s.includes(hide_song[e])||hide_song.splice(e--,1)}function timestamp(e){let t=entry[e][entry_idx.time];return t?"?t="+t:""}function get_search_input(){return $("#search_input").val().normalize("NFKC").toLowerCase().trim()}const attr_idx=["others","アニソン","ラブライブ","アイマス","マクロス","J-POP","ボカロ","ジブリ","特撮","ロック","歌謡曲","disney"];let rep_list=[],rep_singer=[1,1,1,1,1,1],rep_anisong={lovelive:[1,2],imas:[1,3],macros:[1,4],other:[1,1]},rep_genre={jpop:[1,5],voc:[1,6],jib:[1,7],tok:[1,8],rock:[1,9],kay:[1,10],dis:[1,11],other:[1,0]};const oke_gone=["ノーザンクロス"];let selected_member=[4,2,1,32,16,8];const selected_member_ram=[4,2,1,32,16,8],name_lookup=["kirara","momo","nia","chui","shiro","yuco"],exist=e=>selected_member.includes(e);let longpress_timer,post_longpress_timer,is_long_pressing=!1;$(function(){$(document).on("blur","#rep_input",function(){input_focused=!1,rep_search()}),$(document).on("keydown",function(e){e.keyCode===13&&current_page==="repertoire"&&$("#rep_input").blur()}),$(document).on("click","#filter_display",function(){$("#filter_close").toggleClass("closed"),$("#filter_content").toggleClass("hidden")}),$(document).on("click",".filter_icon",function(){let e=$(this).attr("class").split(/\s+/).find(e=>e.startsWith("icon_")).replace("icon_","");rep_singer[name_lookup.indexOf(e)]^=1,$(this).toggleClass("selected"),rep_search(!0)}),$(document).on("click",".filter_anisong",function(){let e=this.id.replace("anisong_","");if(e==="all"){$(".filter_anisong .checkbox").toggleClass("selected",!$("#anisong_all .checkbox").hasClass("selected"));for(let e in rep_anisong)rep_anisong[e][0]=$("#anisong_all .checkbox").hasClass("selected")?1:0}else if($(`#${this.id} .checkbox`).toggleClass("selected"),rep_anisong[e][0]^=1,$(`#${this.id} .checkbox`).hasClass("selected")){for(let e in rep_anisong)if(!rep_anisong[e][0]){rep_search();return}$("#anisong_all .checkbox").addClass("selected")}else $("#anisong_all .checkbox").removeClass("selected");rep_search()}),$(document).on("click",".filter_genre",function(){let t=this.id.replace("genre_","");const e="#genre_all .checkbox";if(t==="all"){$(".filter_genre .checkbox").toggleClass("selected",!$(e).hasClass("selected"));for(let t in rep_genre)rep_genre[t][0]=$(e).hasClass("selected")?1:0}else if($(`#${this.id} .checkbox`).toggleClass("selected"),rep_genre[t][0]^=1,$(`#${this.id} .checkbox`).hasClass("selected")){for(let e in rep_genre)if(!rep_genre[e][0]){rep_search();return}$(e).addClass("selected")}else $(e).removeClass("selected");rep_search()}),$(document).on("click",".filter_sort",function(){let e=this.id.replace("sort_","");if(setting.rep_sort===e)return;$(".filter_sort .radio").removeClass("selected"),$(`#${this.id} .radio`).addClass("selected"),setting.rep_sort=e,update_rep_sort_display(),rep_display()}),$(document).on("click","#filter_asd",function(){setting.rep_sort_asd^=1,update_rep_sort_display(),rep_display()}),$(document).on("click","#sort_selected",function(){setting.rep_selected_first^=1,$("#sort_selected .checkbox").toggleClass("selected"),rep_display()}),$(document).on("click",".rep_song_container",function(){if(is_long_pressing)return;let e=parseInt(this.id.replace("rep_song_",""));$(this).hasClass("selected")?(rep_selected.splice(rep_selected.indexOf(e),1),rep_selected.length||$("#nav_share").addClass("disabled")):(rep_selected.push(e),$("#nav_share").removeClass("disabled")),$(this).toggleClass("selected")}),$(document).on("mousedown touchstart",".rep_song_container",function(){if(!setting.longPress_copy)return;let e=parseInt(this.id.replace("rep_song_",""));longpress_timer=setTimeout(function(){navigator.clipboard.writeText(song[e][song_idx.name]),copy_popup(),is_long_pressing=!0,post_longpress_timer=setTimeout(function(){is_long_pressing=!1,clearTimeout(post_longpress_timer)},setting.longPress_time-100)},setting.longPress_time)}),$(document).on("mouseup mouseleft touchend touchmove",".rep_song_container",function(){clearTimeout(longpress_timer)}),$(document).on("click","#nav_share",function(){if(current_page!=="repertoire"||$(this).hasClass("disabled")||prevent_menu_popup)return;prevent_menu_popup=!0,$(document.body).toggleClass("no_scroll"),$("#rep_share").removeClass("hidden"),$("#popup_container").removeClass("hidden")}),$(document).on("click","#rep_share_search",function(){$("#popup_container").click(),is_searching_from_rep=1,jump2page("search"),hits=copy_of(rep_selected),search_memory="!bulk_load_flag",$("#input").val(""),update_display(1)}),$(document).on("click","#rep_share_link",function(){$("#popup_container").click();let e="szk31.github.io/pcsl/?search="+song_lookup.indexOf(rep_selected[0]);for(let t=1;t<rep_selected.length;++t)e+=","+song_lookup.indexOf(rep_selected[t]);navigator.clipboard.writeText(e),copy_popup()}),$(document).on("click","#rep_share_tweet",function(){$("#rep_share").addClass("hidden"),$("#rep_tweet").removeClass("hidden")}),$(document).on("click",".rep_tweet_a",function(){if(setting.rep_show_artist==(this.id==="rep_tweet_ya"))return;setting.rep_show_artist^=1,$(".rep_tweet_a").toggleClass("selected"),ls("pcsl_s_rep_artist",setting.rep_show_artist?1:0)}),$(document).on("click",".rep_tweet_submit",function(){let e="";for(let t in rep_selected)e+=`${song[rep_selected[t]][song_idx.name]}${setting.rep_show_artist?" / "+song[rep_selected[t]][song_idx.artist]:""}
`;const n={k:"#うたってきららちゃま",m:"#ももっとリクエスト",y:"#つきみゆこ"};let t=this.id.replace("rep_tweet_","");switch(t){case"t":navigator.clipboard.writeText(e),copy_popup();break;default:window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(e+n[t]),"_blank")}$("#popup_container").click()})});let rep_hits=[],rep_hits_solo=[],rep_selected=[],rep_input_memory="";function rep_search(e=!1){let t=$("#rep_input").val().normalize("NFKC").trim().toLowerCase();if(t!==rep_input_memory)rep_input_memory=t;else if(!e&&t)return;if(selected_member=[],rep_singer.forEach((e,t)=>e?selected_member.push(selected_member_ram[t]):null),t){rep_hits=[];for(let e=1;e<song.length;++e){if(!entry_proc[e].length)continue;(processed_song_name[e].includes(t)||song[e][song_idx.reading].includes(t))&&rep_hits.push(e)}rep_display();return}if(!selected_member.length){clearInterval(rep_display_inter),$("#rep_display").html(""),$("#rep_count").html(`hits: 0`);return}let n=inv_mask=0;Object.values(rep_anisong).concat(Object.values(rep_genre)).forEach(e=>n+=e[0]<<e[1]),Object.values(rep_anisong).forEach(e=>inv_mask+=e[0]<<e[1]),inv_mask=~inv_mask&28,rep_hits=[];for(i in song)rep_hits_solo[i].some(exist)&&song[i][song_idx.attr]&n&&!(song[i][song_idx.attr]&inv_mask)&&rep_hits.push(i);rep_display()}let rep_display_inter;function rep_display(){switch($("#rep_count").html(`hit${rep_hits.length>1?"s":""}: ${rep_hits.length}`),setting.rep_selected_first&&(rep_hits=rep_hits.filter(e=>!rep_selected.includes(e))),$("#rep_display").html(""),setting.rep_sort){case"50":rep_hits.sort((e,t)=>(setting.rep_sort_asd?1:-1)*(e-t));break;case"count":let e=[];rep_hits.forEach(t=>e[t]=selected_member.length===6?entry_proc[t].length:entry_proc[t].filter(e=>split_to_solo(entry[e][entry_idx.type]).some(e=>selected_member.includes(e))).length),rep_hits.sort((t,n)=>(setting.rep_sort_asd?1:-1)*(e[n]-e[t]));break;case"date":let t=[];rep_hits.forEach(e=>{let n=get_last_sang(e,selected_member);t[e]=n?n.getTime():0}),rep_hits.sort((e,n)=>(setting.rep_sort_asd?1:-1)*(t[n]-t[e]));break;case"release":let n=[];rep_hits.forEach(e=>n[e]=to8601(song[e][song_idx.release]).getTime()),rep_hits.sort((e,t)=>(setting.rep_sort_asd?1:-1)*(n[t]-n[e]));break}setting.rep_selected_first&&(rep_hits=rep_selected.concat(rep_hits)),rep_loading_progress=0,rep_display_loop(),clearInterval(rep_display_inter),rep_display_inter=setInterval(rep_display_loop,10)}let rep_loading_progress=0;function rep_display_loop(){let e=Math.min(rep_loading_progress+20,rep_hits.length);for(let t=rep_loading_progress;t<e;++t){let n=get_sang_count(rep_hits[t],selected_member),o=get_last_sang(rep_hits[t],selected_member),s=o===0?-1:get_date_different(o),i=`<div class="rep_song_container${rep_selected.includes(rep_hits[t])?" selected":""}${n[0]&&n[0]===n[1]?" rep_mem_only":""}" id="rep_song_${rep_hits[t]}"><div class="rep_song_row1"><div class="rep_song_title">${song[rep_hits[t]][song_idx.name]} / ${song[rep_hits[t]][song_idx.artist]}</div><div class="rep_song_nooke">${oke_gone.includes(song[rep_hits[t]][song_idx.name])?"オケ消滅":""}</div></div><div class="rep_song_info grid_block-4"><div>${s===0?"今日":s===-1?"---":`${s}日前`}</div><div>${n[0]}回${n[1]>0?n[0]===n[1]?" (メン限のみ)":` (${n[1]}回メン限)`:""}</div><div class="rep_song_singer${key_valid?" rep_singer_2rows":""}"><div${rep_hits_solo[rep_hits[t]].includes(4)?` class="singer_4"`:""}></div><div${rep_hits_solo[rep_hits[t]].includes(2)?` class="singer_2"`:""}></div><div${rep_hits_solo[rep_hits[t]].includes(1)?` class="singer_1"`:""}></div>${key_valid?`<div${rep_hits_solo[rep_hits[t]].includes(32)?` class="singer_32"`:""}></div><div${rep_hits_solo[rep_hits[t]].includes(16)?` class="singer_16"`:""}></div><div${rep_hits_solo[rep_hits[t]].includes(8)?` class="singer_8"`:""}></div>`:""}</div>${setting.show_release?`<div class="rep_extra_info"> (${display_date(to8601(song[rep_hits[t]][song_idx.release]))})</div>`:"<div></div>"}</div></div>`;$("#rep_display").append(i)}rep_loading_progress+=20,rep_loading_progress>=rep_hits.length&&(clearInterval(rep_display_inter),$("#rep_display").append('<div class="general_vertical_space"></div>'))}function update_rep_sort_display(){let e="";switch(setting.rep_sort){case"50":e=setting.rep_sort_asd?"正順 (⇌逆順)":"逆順 (⇌正順)";break;case"count":e=setting.rep_sort_asd?"多い順 (⇌少ない順)":"少ない順 (⇌多い順)";break;case"date":case"release":e=setting.rep_sort_asd?"新しい順 (⇌古い順)":"古い順 (⇌新しい順)";break;default:return 1}$("#filter_asd div:nth-child(2)").html(e)}