const r2k_lookup = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "sa": "さ", "si": "し", "su": "す", "se": "せ", "so": "そ",
    "ta": "た", "ti": "ち", "tu": "つ", "te": "て", "to": "と",
    "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
    "ha": "は", "hi": "ひ", "hu": "ふ", "he": "へ", "ho": "ほ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
    "ya": "や", "yi": "い", "yu": "ゆ", "yo": "よ",
    "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
    "wa": "わ", "wo": "を",
    "nn": "ん",
    
    "ca": "か", "ci": "し", "cu": "く", "ce": "せ", "co": "こ",
    "wu": "う", "shi": "し", "chi": "ち", "tsu": "つ", 
    
    "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
    "za": "ざ", "zi": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
    "da": "だ", "di": "ぢ", "du": "づ", "de": "で", "do": "ど",
    "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",

    "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",

    "ji": "じ",

    "kya": "きゃ", "kyi": "きぃ", "kyu": "きゅ", "kye": "きぇ", "kyo": "きょ",
    "sya": "しゃ", "syi": "しぃ", "syu": "しゅ", "sye": "しぇ", "syo": "しょ",
    "tya": "ちゃ", "tyi": "ちぃ", "tyu": "ちゅ", "tye": "ちぇ", "tyo": "ちょ",
    "nya": "にゃ", "nyi": "にぃ", "nyu": "にゅ", "nye": "にぇ", "nyo": "にょ",
    "hya": "ひゃ", "hyi": "ひぃ", "hyu": "ひゅ", "hye": "ひぇ", "hyo": "ひょ",
    "mya": "みゃ", "myi": "みぃ", "myu": "みゅ", "mye": "みぇ", "myo": "みょ",
    "rya": "りゃ", "ryi": "りぃ", "ryu": "りゅ", "rye": "りぇ", "ryo": "りょ",

    "sha": "しゃ", "shu": "しゅ", "she": "しぇ", "sho": "しょ",
    "tha": "てゃ", "thi": "てぃ", "thu": "てゅ", "the": "てぇ", "tho": "てょ",   
    
    "gya": "ぎゃ", "gyi": "ぎぃ", "gyu": "ぎゅ", "gye": "ぎぇ", "gyo": "ぎょ",
    "jya": "じゃ", "jyi": "じぃ", "jyu": "じゅ", "jye": "じぇ", "jyo": "じょ",
    "zya": "じゃ", "zyi": "じぃ", "zyu": "じゅ", "zye": "じぇ", "zyo": "じょ",
    "dya": "ぢゃ", "dyi": "ぢぃ", "dyu": "ぢゅ", "dye": "ぢぇ", "dyo": "ぢょ",
    "bya": "びゃ", "byi": "びぃ", "byu": "びゅ", "bye": "びぇ", "byo": "びょ",

    "cya": "ちゃ", "cyu": "ちゅ", "cye": "ちぇ", "cyo": "ちょ",
    "ja": "じゃ", "ju": "じゅ", "je": "じぇ", "jo": "じょ",
    "fa": "ふぁ", "fi": "ふぃ", "fu": "ふ", "fe": "ふぇ", "fo": "ふぉ",
    
    "va": "ヴぁ", "vi": "ヴぃ", "vu": "ヴ", "ve": "ヴぇ", "vo": "ヴぉ",
    "wi": "うぃ", "we": "うぇ",
    
    "vya": "ヴゃ", "vyi": "ヴぃ", "vyu": "ヴゅ", "vye": "ヴぇ", "vyo": "ヴょ",
    "ye": "いぇ", "wyi": "ゐ", "wye": "ゑ",

    "la": "ぁ", "li": "ぃ", "lu": "ぅ", "le": "ぇ", "lo": "ぉ",
    "xa": "ぁ", "xi": "ぃ", "xu": "ぅ", "xe": "ぇ", "xo": "ぉ",
    
    "lya": "ゃ", "lyi": "ぃ", "lyu": "ゅ", "lye": "ぇ", "lyo": "ょ",
    "xya": "ゃ", "xyi": "ぃ", "xyu": "ゅ", "xye": "ぇ", "xyo": "ょ",

    ",": "、", ".": "。", "-": "ー", "n": "ん"
};

function r2k(input) {
// test if input only consist of [a-z]
    input = input.toLowerCase();
    if (/^(?![a-z,.-]+$).+/.test(input)) {
        return;
    }
    // check for ltu-s
    // note: tc- or ct- is NOT a special case and no one should type like this
    input = input.replace(/([^aeioun])(?=\1)/gi, "っ");
    
    // convert to all kana
    let cur_pos = 0;
    let result = "";
    while (cur_pos < input.length) {
        let ext_char = [
            // note: substring does not throw an error if end_index > string.length
            input.substring(cur_pos, cur_pos + 3),
            input.substring(cur_pos, cur_pos + 2),
            input[cur_pos]
        ];
        let found = 0;
        for (let i = 0; i < 3; ++i) {
            const e = r2k_lookup[ext_char[i]];
            if (e) {
                result += e;
                found = 1;
                cur_pos += 3 - i;
                break;
            }
        }
        if (!found) {
            result += input[cur_pos];
            cur_pos++;
        }
    }
    return result;
}