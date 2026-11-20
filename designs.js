/* =========================================================
   ジャッチュ「じぶんの電車」の保存（このスマホの中だけ）

   作った電車のデザインを、ブラウザの中のデータベース（IndexedDB）に保存する。
   サーバーには送らないので、ほかの人には見えない。
   ※ ブラウザの「履歴とWebサイトデータを消去」をすると消えます。

   1台ぶんのデータ：
     id       : 名前（"d" + 作った時刻）
     name     : 電車の名前
     created / updated : 作った時刻・直した時刻
     state    : デザインの設定（色・模様・文字・おえかき・ステッカー）
     photo    : 貼った写真（画像ファイル）。なければ null
     texture  : 3Dの電車に貼る絵（2048×2048 の JPEG）
     thumb    : 一覧に出す、車体の横の小さな絵（data URL）
   ========================================================= */
(function () {
  const DB_NAME = "jatchu", STORE = "designs", VER = 1;
  let dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((ok, ng) => {
      if (!window.indexedDB) { ng(new Error("このブラウザでは保存できません")); return; }
      const r = indexedDB.open(DB_NAME, VER);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE, { keyPath: "id" }); };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => ng(r.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const db = await open();
    return new Promise((ok, ng) => {
      const t = db.transaction(STORE, mode), st = t.objectStore(STORE);
      let out; const req = fn(st);
      if (req) req.onsuccess = () => { out = req.result; };
      t.oncomplete = () => ok(out);
      t.onerror = () => ng(t.error);
      t.onabort = () => ng(t.error);
    });
  }
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- 「AR合成」のマーク ----------
     電車の絵（テクスチャ）に直接かきこむので、あとから消せない。
     ARで写した写真・動画で、電車の部分だけを切り取っても残る。
     SIDES：2048×2048 のテクスチャの中で、車体の横の場所 */
  const SIDES = [[81, 103, 1966, 501], [81, 605, 1966, 1003]];
  function drawMark(g, x, y, w, h) {
    const mh = h * 0.14, mw = mh * 4.6, mx = x + w - mw - w * 0.015, my = y + h * 0.79, r = mh * 0.3;
    g.save();
    g.fillStyle = "rgba(16,20,28,.85)";
    g.beginPath(); g.moveTo(mx + r, my); g.arcTo(mx + mw, my, mx + mw, my + mh, r); g.arcTo(mx + mw, my + mh, mx, my + mh, r);
    g.arcTo(mx, my + mh, mx, my, r); g.arcTo(mx, my, mx + mw, my, r); g.closePath(); g.fill();
    g.fillStyle = "#fff"; g.textBaseline = "middle"; g.textAlign = "center";
    g.font = `bold ${Math.round(mh * 0.5)}px sans-serif`;
    g.fillText("AR合成 ・ Jatchu", mx + mw / 2, my + mh / 2);
    g.restore();
  }
  // テクスチャ全体（大きさ size の正方形）の、両側の車体にマークをかく
  function markTexture(g, size = 2048) {
    const k = size / 2048;
    for (const [x0, y0, x1, y1] of SIDES) drawMark(g, x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k);
  }

  window.JatchuDB = {
    SIDES, drawMark, markTexture,
    newId: () => "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    // 一覧（新しく直した順）。texture や photo は重いので入れない
    async list() {
      const all = (await tx("readonly", (st) => st.getAll())) || [];
      return all.sort((a, b) => b.updated - a.updated)
        .map(({ id, name, created, updated, thumb }) => ({ id, name, created, updated, thumb }));
    },
    get: (id) => tx("readonly", (st) => st.get(id)),
    put: (rec) => tx("readwrite", (st) => st.put(rec)),
    async remove(id) { await tx("readwrite", (st) => st.delete(id)); if (this.current === id) this.current = null; },
    // 今えらんでいる電車（つくる・走らせるで使う）
    get current() { return store.get("jatchu_current"); },
    set current(id) { store.set("jatchu_current", id); },
    // 走らせる電車：URL の ?id= → 今えらんでいる電車 → いちばん新しい電車
    async pick(id) {
      const tryGet = async (k) => (k ? await this.get(k) : null);
      return (await tryGet(id)) || (await tryGet(this.current)) || (await tryGet((await this.list())[0]?.id)) || null;
    },
  };
})();
