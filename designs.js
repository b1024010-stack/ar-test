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

  window.JatchuDB = {
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
