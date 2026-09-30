/* =========================================================
   ジャッチュ お店データ（案内板と AR 電車で共通）
   ここを書き換えると、案内板と AR の両方が変わります。
   ※ 花もめん以外はサンプルの架空店舗です。

   id    : URL に使う名前（半角英数字）
   st    : 空席状況  ok = 空席あり / few = 残りわずか / full = 満席
   wrap  : 電車のラッピング画像（null なら元の花もめんラッピング）
   menu  : 本日の限定メニュー
   ========================================================= */
window.JATCHU_SHOPS = [
  { id:"hanamomen",  name:"花もめん",   genre:"居酒屋・串", st:"ok",
    wrap:null,                     menu:"本日限定 鴨ロース串",
    catch:"刺身・寿司・自家製豆腐" },
  { id:"yakitori-a", name:"やきとり A", genre:"焼き鳥",     st:"few",
    wrap:"wrap-yakitori-a.jpg",    menu:"数量限定 つくね",
    catch:"炭火焼・秘伝のタレ" },
  { id:"sakaba-b",   name:"酒場 B",     genre:"日本酒",     st:"ok",
    wrap:"wrap-sakaba-b.jpg",      menu:"今月の地酒 飲みくらべ",
    catch:"函館の地酒がそろう酒場" },
  { id:"shokudo-c",  name:"食堂 C",     genre:"海鮮・定食", st:"full",
    wrap:"wrap-shokudo-c.jpg",     menu:"朝どれ いか刺し定食",
    catch:"朝どれ海鮮・定食" },
  { id:"bar-d",      name:"バル D",     genre:"ワイン",     st:"ok",
    wrap:"wrap-bar-d.jpg",         menu:"道産ワイン グラス500円",
    catch:"WINE & TAPAS" },
];

window.JATCHU_STATUS = {
  ok:   ["○ 空席",   "ok"],
  few:  ["△ わずか", "few"],
  full: ["× 満席",   "full"],
};
