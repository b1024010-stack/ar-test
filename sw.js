/* =========================================================
   ジャッチュ オフライン用のしくみ（サービスワーカー）
   一度開いたページ・3Dモデル・部品をスマホに取っておき、
   2回目からは速く開く。電波が弱い・ないところでも動く。

   ■ ファイルを新しくしたら、下の VERSION の数字を1つ増やす
   ========================================================= */
const VERSION = "jatchu-v15";
// 最初に取っておくもの（このサイトの中）
const CORE = [
  "./", "index.html", "maker.html", "mine.html", "rail.html", "privacy.html", "terms.html", "gogo.png", "shapes.js?v=3", "robot.js?v=1",
  "lang.js", "guard.js", "icons.js", "designs.js", "count.js", "manifest.json",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png",
  "wrap-base.jpg?v=1", "mini-hanamomen.glb?v=6", "tram-hanamomen.glb?v=2",
];
// 使ったときに取っておく、外のサイトの部品（3Dの表示・文字の形）
const CDN = ["ajax.googleapis.com", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com"];
// 取っておかないもの（アクセス数）
const SKIP = ["goatcounter.com", "gc.zgo.at"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || SKIP.some((h) => url.hostname.endsWith(h))) return;
  const same = url.origin === location.origin;
  if (!same && !CDN.includes(url.hostname)) return;

  // ページ（HTML）：新しいものを先に見に行き、つながらなければ取っておいたもの
  if (req.mode === "navigate" || (same && /\.html$|\/$/.test(url.pathname))) {
    e.respondWith(fetch(req).then((res) => { put(req, res.clone()); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html"))));
    return;
  }
  // 外のサイトの部品：一度取ったら、それを使う（版の番号つきで変わらないので）
  if (!same) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { put(req, res.clone()); return res; })));
    return;
  }
  // このサイトのファイル：取っておいたものをすぐ使い、うしろで新しいものに取りかえる
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
function put(req, res) {
  if (!res || (res.status !== 200 && res.type !== "opaque")) return;
  caches.open(VERSION).then((c) => c.put(req, res)).catch(() => {});
}
