/* =========================================================
   ジャッチュ アクセス数を数える（GoatCounter）

   ■ 最初に1回だけ：下の JATCHU_COUNTER に、GoatCounter で決めた「コード」を書く
     例）https://jatchu-hakodate.goatcounter.com なら "jatchu-hakodate"
   ■ 空のままなら、何も数えません（今まで通り動きます）

   数えるもの（個人を特定する情報や Cookie は使いません）
     ・ページを開いた数（お店・電停ごと）  例）/mini.html?shop=hanamomen
     ・QRコードから来た数                  例）QR → mini.html?shop=hanamomen
     ・ARを始めた数（お店ごと）            例）AR開始 → hanamomen
     ・外国語で使った数                    例）ことば → en
   ========================================================= */
window.JATCHU_COUNTER = "among";   // ← ここに GoatCounter のコードを "" の間に書く

(function () {
  const code = String(window.JATCHU_COUNTER || "").trim();
  const queue = [];
  let ready = false;
  const send = (o) => { try { window.goatcounter.count(o); } catch (e) {} };

  // ページの中から呼ぶ：jatchuCount("AR開始 → hanamomen")
  window.jatchuCount = function (name, title) {
    const o = { path: name, title: title || name, event: true };
    if (ready) send(o); else queue.push(o);
  };

  // コードが無い・パソコンの中のファイルで開いたときは数えない
  if (!code || !/^https?:$/.test(location.protocol)) { window.jatchuCount = function () {}; return; }

  // ページの名前：アドレスのうち、お店（shop）と電停（stop）だけ残す（言語や from=qr で分かれないように）
  const sp = new URLSearchParams(location.search);
  const page = location.pathname.replace(/.*\//, "") || "index.html";
  const keep = ["shop", "stop"].filter((k) => sp.get(k)).map((k) => k + "=" + sp.get(k));
  const path = "/" + page + (keep.length ? "?" + keep.join("&") : "");

  window.goatcounter = { no_onload: true };      // 数え方はこちらで決める
  queue.push({ path, title: document.title });
  if (sp.get("from") === "qr") queue.push({ path: "QR → " + path.slice(1), title: "QRコードから来た", event: true });

  // 外国語で使っている人（ブラウザを開いている間に1回だけ）
  try {
    const l = sp.get("lang") || localStorage.getItem("jatchu_lang") || "";
    if (l && l !== "ja" && !sessionStorage.getItem("jatchu_lang_counted")) {
      queue.push({ path: "ことば → " + l, title: "ことば：" + l, event: true });
      sessionStorage.setItem("jatchu_lang_counted", "1");
    }
  } catch (e) {}

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = "https://" + code + ".goatcounter.com/count";
  s.onload = () => { ready = true; while (queue.length) send(queue.shift()); };
  document.head.appendChild(s);
})();
