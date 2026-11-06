/* =========================================================
   ジャッチュ「営利目的で使わせない」ためのしくみ（全ページで読みこむ）

   1. 公式の場所でしか動かない
      今のアドレス（OFFICIAL_HOST）以外にコピーして置かれたら、
      「公式ではありません」と出して、使えないようにする
   2. 電車の名前・文字のチェック
      URL・電話番号・値段・セールなど、広告のような言葉が入っていたら使えないようにする
      （JatchuGuard.check(文字) → 問題があれば理由、なければ null）
   ========================================================= */
(function () {
  const OFFICIAL_HOST = "b1024010-stack.github.io";
  const OFFICIAL_URL = "https://b1024010-stack.github.io/ar-test/";
  const DEV_HOSTS = ["localhost", "127.0.0.1", ""];      // 自分のパソコンで試すとき

  /* ---------- 1. 公式の場所かどうか ---------- */
  const host = location.hostname;
  const official = host === OFFICIAL_HOST || DEV_HOSTS.includes(host);
  if (!official) {
    window.JATCHU_UNOFFICIAL = true;
    const show = () => {
      const d = document.createElement("div");
      d.setAttribute("role", "alertdialog");
      d.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
        "gap:14px;padding:24px;background:#0b0b0c;color:#f4f1e8;text-align:center;font:15px/1.8 -apple-system,'Hiragino Sans',sans-serif";
      d.innerHTML = '<div style="font-size:40px">⚠</div>' +
        '<b style="font-size:18px">このページは、公式のジャッチュではありません</b>' +
        '<div>ジャッチュは、許可なくコピー・転用・商用利用することを禁止しています。<br>This is not the official Jatchu site.</div>' +
        '<a href="' + OFFICIAL_URL + '" style="color:#ffb020;font-weight:900">公式のジャッチュへ →</a>';
      document.body.appendChild(d);
      document.documentElement.style.overflow = "hidden";
    };
    if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
  }

  /* ---------- 2. 広告のような言葉のチェック ---------- */
  const RULES = [
    [/https?:|www\.|\.(com|jp|net|org|shop|info|io|co)\b|@/i, "URL・メールアドレス・SNSのアカウント"],
    [/\d{2,4}-\d{2,4}-\d{3,4}|\d{8,}|tel/i, "電話番号"],
    [/\d+\s*円|[¥$]\s*\d|\d+\s*%|円引|割引|半額|値引|特価|激安|格安/, "値段・割引"],
    [/セール|\b(sale|off|pr)\b|キャンペーン|クーポン|お得|販売|発売|通販|ご来店|来店|予約受付|期間限定|広告|宣伝/i, "セール・宣伝の言葉"],
    [/株式会社|有限会社|合同会社|\(株\)|\(有\)|\b(inc|ltd|llc|corp)\b/i, "会社の名前"],
  ];
  function check(text) {
    const t = String(text || "").normalize("NFKC").replace(/\s+/g, " ");
    for (const [re, why] of RULES) if (re.test(t)) return why;
    return null;
  }

  window.JatchuGuard = { official, check, OFFICIAL_URL };
})();
