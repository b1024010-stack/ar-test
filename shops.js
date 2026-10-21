/* =========================================================
   ジャッチュ お店データ（案内板と AR 電車で共通）

   ■ ふだんの更新は Google スプレッドシートで
     下の JATCHU_SHEET_URL に、スプレッドシートを「ウェブに公開」した
     CSV の URL を貼ると、表を書き換えるだけで案内板と AR に反映されます。
     （反映まで 5 分ほどかかることがあります）

   ■ URL が空のとき・読み込めないときは、下の「最初から入っているデータ」を使います。
   ========================================================= */
window.JATCHU_SHEET_URL = "";   // ← ここに CSV の URL を "" の間に貼る

// 電車のモデル（mini-◯◯.glb / tram-◯◯.glb）があるお店。表の「電車」の欄にはこの中から選ぶ
window.JATCHU_MODELS = ["hanamomen", "yakitori-a", "sakaba-b", "shokudo-c", "bar-d"];

/* ---------- 最初から入っているデータ（表が読めないときに使う） ----------
   id    : URL に使う名前（半角英数字）
   st    : 空席状況  ok = 空席あり / few = 残りわずか / full = 満席
   model : 走らせる電車のデザイン（JATCHU_MODELS のどれか）
   menu  : 本日の限定メニュー
   ※ 花もめん以外はサンプルの架空店舗です。 */
window.JATCHU_SHOPS = [
  { id:"hanamomen",  name:"花もめん",   genre:"居酒屋・串", st:"ok",   model:"hanamomen",
    menu:"本日限定 鴨ロース串",     catch:"刺身・寿司・自家製豆腐" },
  { id:"yakitori-a", name:"やきとり A", genre:"焼き鳥",     st:"few",  model:"yakitori-a",
    menu:"数量限定 つくね",         catch:"炭火焼・秘伝のタレ" },
  { id:"sakaba-b",   name:"酒場 B",     genre:"日本酒",     st:"ok",   model:"sakaba-b",
    menu:"今月の地酒 飲みくらべ",   catch:"函館の地酒がそろう酒場" },
  { id:"shokudo-c",  name:"食堂 C",     genre:"海鮮・定食", st:"full", model:"shokudo-c",
    menu:"朝どれ いか刺し定食",     catch:"朝どれ海鮮・定食" },
  { id:"bar-d",      name:"バル D",     genre:"ワイン",     st:"ok",   model:"bar-d",
    menu:"道産ワイン グラス500円",  catch:"WINE & TAPAS" },
];

/* ---------- 外国語の訳（lang.js で切り替え。表では「店名_en」のような列で書ける） ---------- */
(function () {
  const TR = {
    "hanamomen": {
      en:        { name:"Hanamomen", genre:"Izakaya / Skewers", menu:"Duck loin skewers", catch:"Sashimi, sushi, house-made tofu" },
      "zh-Hant": { name:"花もめん", genre:"居酒屋・串燒", menu:"鴨里肌串", catch:"生魚片・壽司・自製豆腐" },
      "zh-Hans": { name:"花もめん", genre:"居酒屋・串烧", menu:"鸭里脊串", catch:"刺身・寿司・自制豆腐" },
      ko:        { name:"하나모멘", genre:"이자카야・꼬치", menu:"오리 등심 꼬치", catch:"회・스시・수제 두부" } },
    "yakitori-a": {
      en:        { name:"Yakitori A", genre:"Yakitori (grilled chicken)", menu:"Tsukune chicken meatballs (limited)", catch:"Charcoal-grilled with a secret sauce" },
      "zh-Hant": { name:"烤雞串 A", genre:"烤雞串", menu:"雞肉丸串（限量）", catch:"炭火燒烤・祕傳醬汁" },
      "zh-Hans": { name:"烤鸡串 A", genre:"烤鸡串", menu:"鸡肉丸串（限量）", catch:"炭火烧烤・秘传酱汁" },
      ko:        { name:"야키토리 A", genre:"닭꼬치", menu:"츠쿠네 (수량 한정)", catch:"숯불구이・비전의 소스" } },
    "sakaba-b": {
      en:        { name:"Sakaba B", genre:"Japanese sake", menu:"Local sake tasting set of the month", catch:"A bar with Hakodate's local sake" },
      "zh-Hant": { name:"酒場 B", genre:"日本酒", menu:"本月在地酒 品飲組合", catch:"函館在地酒齊聚的酒館" },
      "zh-Hans": { name:"酒场 B", genre:"日本酒", menu:"本月当地酒 品饮组合", catch:"汇集函馆当地酒的酒馆" },
      ko:        { name:"사카바 B", genre:"사케(일본주)", menu:"이달의 지역 사케 비교 시음", catch:"하코다테 지역 사케가 모인 술집" } },
    "shokudo-c": {
      en:        { name:"Shokudo C", genre:"Seafood / Set meals", menu:"Fresh squid sashimi set meal", catch:"Morning-caught seafood and set meals" },
      "zh-Hant": { name:"食堂 C", genre:"海鮮・定食", menu:"早晨現撈 烏賊生魚片定食", catch:"早晨現撈海鮮・定食" },
      "zh-Hans": { name:"食堂 C", genre:"海鲜・定食", menu:"早上现捞 鱿鱼刺身定食", catch:"早上现捞海鲜・定食" },
      ko:        { name:"쇼쿠도 C", genre:"해산물・정식", menu:"아침에 잡은 오징어회 정식", catch:"아침에 잡은 해산물・정식" } },
    "bar-d": {
      en:        { name:"Bar D", genre:"Wine", menu:"Hokkaido wine ¥500 a glass", catch:"WINE & TAPAS" },
      "zh-Hant": { name:"Bar D", genre:"葡萄酒", menu:"北海道產葡萄酒 每杯500日圓", catch:"WINE & TAPAS" },
      "zh-Hans": { name:"Bar D", genre:"葡萄酒", menu:"北海道产葡萄酒 每杯500日元", catch:"WINE & TAPAS" },
      ko:        { name:"바 D", genre:"와인", menu:"홋카이도산 와인 한 잔 500엔", catch:"WINE & TAPAS" } },
  };
  for (const s of window.JATCHU_SHOPS) if (TR[s.id]) s.i18n = TR[s.id];
})();

window.JATCHU_STATUS = {
  ok:   ["○ 空席",   "ok"],
  few:  ["△ わずか", "few"],
  full: ["× 満席",   "full"],
};

/* =========================================================
   ここから下はスプレッドシートを読み込むしくみ（ふだんは触らなくてOK）
   ========================================================= */
(function () {
  const CACHE = "jatchu_shops_cache";
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(CACHE)); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(CACHE, JSON.stringify(v)); } catch (e) {} },
  };

  // CSV を表（2次元の配列）にする。"…" で囲まれたカンマや改行にも対応
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    text = text.replace(/^﻿/, "");
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim() !== ""));
  }

  // 見出しの名前（日本語でも英語でもOK）→ データの項目
  const HEAD = {
    id: ["id"], name: ["店名", "名前", "name"], genre: ["ジャンル", "genre"],
    st: ["空席", "空席状況", "st", "status"], menu: ["本日限定", "限定メニュー", "メニュー", "menu"],
    catch: ["ひとこと", "紹介", "catch"], model: ["電車", "電車のデザイン", "model"],
    show: ["表示", "のせる", "show"],
  };
  const norm = (s) => String(s || "").normalize("NFKC").trim().toLowerCase();
  // 外国語の列：「店名_en」「本日限定_ko」「ジャンル_zh-hant」など（見出しの後ろにことばの記号）
  const LANG_TAG = { "en":"en", "english":"en", "英語":"en",
    "zh-hant":"zh-Hant", "zh_hant":"zh-Hant", "zh-tw":"zh-Hant", "zh_tw":"zh-Hant", "繁体":"zh-Hant", "繁體":"zh-Hant",
    "zh-hans":"zh-Hans", "zh_hans":"zh-Hans", "zh-cn":"zh-Hans", "zh_cn":"zh-Hans", "zh":"zh-Hans", "简体":"zh-Hans", "簡体":"zh-Hans",
    "ko":"ko", "kr":"ko", "韓国語":"ko" };
  function langCols(head) {                             // [{ field, lang, idx }]
    const out = [];
    head.forEach((h, idx) => {
      const m = h.match(/^(.+?)[\s_(:]+([a-z_-]+|英語|繁体|繁體|简体|簡体|韓国語)\)?$/);
      if (!m || !LANG_TAG[m[2]]) return;
      for (const f of ["name", "genre", "menu", "catch"]) if (HEAD[f].some((n) => norm(n) === m[1])) out.push({ field: f, lang: LANG_TAG[m[2]], idx });
    });
    return out;
  }

  function statusOf(v) {
    const s = norm(v);
    if (/^(full|満|×|x|✕)/.test(s) || s.includes("満席")) return "full";
    if (/^(few|△|わずか|残り)/.test(s) || s.includes("わずか")) return "few";
    return "ok";
  }
  const hidden = (v) => /^(×|x|✕|no|false|0|非表示|しない|いいえ)$/.test(norm(v));
  const slug = (s, i) => (norm(s).replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "shop" + (i + 1));

  function toShops(rows) {
    if (rows.length < 2) return null;
    const head = rows[0].map(norm), col = {};
    for (const k in HEAD) col[k] = head.findIndex((h) => HEAD[k].some((n) => norm(n) === h));
    if (col.name < 0) return null;                       // 「店名」の列がない表は使わない
    const models = window.JATCHU_MODELS, out = [], used = new Set(), lc = langCols(head);
    rows.slice(1).forEach((r, i) => {
      const get = (k) => (col[k] >= 0 ? String(r[col[k]] || "").trim() : "");
      const name = get("name"); if (!name) return;
      if (col.show >= 0 && hidden(get("show"))) return;
      let id = slug(get("id"), i); while (used.has(id)) id += "-2"; used.add(id);
      let model = norm(get("model"));
      if (!models.includes(model)) model = models.includes(id) ? id : "hanamomen";
      const i18n = {};
      for (const { field, lang, idx } of lc) { const v = String(r[idx] || "").trim(); if (v) (i18n[lang] ||= {})[field] = v; }
      out.push({ id, name, genre: get("genre"), st: statusOf(get("st")), model,
                 menu: get("menu"), catch: get("catch"), i18n });
    });
    return out.length ? out : null;
  }
  window.jatchuParse = (text) => toShops(parseCSV(text));   // 確かめる用

  // 前回読み込めた表があれば、まずそれを使う（すぐ表示できるように）
  const cached = store.get();
  if (window.JATCHU_SHEET_URL && cached && cached.url === window.JATCHU_SHEET_URL &&
      Array.isArray(cached.shops) && cached.shops.length) {
    window.JATCHU_SHOPS = cached.shops;
    window.JATCHU_SOURCE = "cache";
  } else window.JATCHU_SOURCE = "default";

  // スプレッドシートを読み直す。成功したら JATCHU_SHOPS を入れ替えて true を返す
  window.jatchuReload = async function () {
    const url = window.JATCHU_SHEET_URL;
    if (!url) return false;
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const shops = toShops(parseCSV(await r.text()));
      if (!shops) throw new Error("表の形がちがいます（1行目に「店名」の列が必要です）");
      window.JATCHU_SHOPS = shops;
      window.JATCHU_SOURCE = "sheet";
      store.set({ url, shops, at: Date.now() });
      return true;
    } catch (e) {
      console.warn("スプレッドシートを読み込めませんでした。前回の内容を使います：", e);
      return false;
    }
  };
  window.JATCHU_READY = window.jatchuReload();

  // id からお店をさがす（表の読み込みを最大 3 秒待つ）
  window.jatchuFind = async function (id) {
    await Promise.race([window.JATCHU_READY, new Promise((ok) => setTimeout(ok, 3000))]);
    return window.JATCHU_SHOPS.find((s) => s.id === id) || null;
  };
  // お店 → 走らせる電車のモデル名
  window.jatchuModelOf = (s) =>
    (s && window.JATCHU_MODELS.includes(s.model) && s.model) ||
    (s && window.JATCHU_MODELS.includes(s.id) && s.id) || "hanamomen";
})();
