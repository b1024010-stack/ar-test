/* =========================================================
   ジャッチュのアイコン（全ページで読みこむ）

   ページの中の絵文字（🏠🎨🚃🛤📷…）を、ジャッチュ用の線のアイコンに自動でおきかえる。
   ・アイコンは文字と同じ色・大きさになる（タブの色の切りかえもそのまま効く）
   ・あとから書きかわった文字（ことばの切りかえ・走らせる画面の表示など）もおきかえる
   ・絵（svg）やプログラムの中の絵文字はそのまま
   アイコンを変えたいときは、下の ICONS の線（SVG）を書きかえる
   ========================================================= */
(function () {
  // 24×24 のマスにかいた線のアイコン
  const ICONS = {
    home:   '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
    brush:  '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.7-.8 1.7-1.6 0-.5-.2-.9-.5-1.2-.3-.4-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.3 17 3 12 3z"/><circle cx="7.5" cy="11.5" r="1.1"/><circle cx="10" cy="7.2" r="1.1"/><circle cx="14.8" cy="7.2" r="1.1"/>',
    tram:   '<path d="M9.5 7 12 3.2 14.5 7"/><path d="M10.3 3.2h3.4"/><rect x="5" y="7" width="14" height="11" rx="2.6"/><rect x="7.4" y="9.4" width="9.2" height="3.6" rx=".8"/><circle cx="8.6" cy="15.4" r=".6"/><circle cx="15.4" cy="15.4" r=".6"/><path d="M8 18 6.5 21M16 18l1.5 3"/>',
    rails:  '<path d="M8 3 5.5 21M16 3l2.5 18"/><path d="M7.3 7h9.4M6.7 12h10.6M6 17h12"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.2 7 9.6 4.5h4.8L15.8 7"/><circle cx="12" cy="13.5" r="3.5"/>',
    film:   '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7.5 5v14M16.5 5v14M3 9.7h4.5M3 14.3h4.5M16.5 9.7H21M16.5 14.3H21"/>',
    trash:  '<path d="M4 7h16M9.5 7V4.5h5V7"/><path d="m6 7 1 13h10l1-13"/><path d="M10 11v5.5M14 11v5.5"/>',
    pencil: '<path d="m4.5 19.5 1-4.8L15.8 4.4a1.6 1.6 0 0 1 2.3 0l1.5 1.5a1.6 1.6 0 0 1 0 2.3L9.3 18.5z"/><path d="m13.8 6.4 3.8 3.8"/>',
    eraser: '<path d="M8.5 20H20"/><path d="m3.8 14.6 9.6-9.6a1.8 1.8 0 0 1 2.5 0l3.6 3.6a1.8 1.8 0 0 1 0 2.5L12 18.6 8.5 20 3.8 15.3z"/><path d="m8.6 9.8 6.1 6.1"/>',
    reload: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
    undo:   '<path d="M9 8 5 12l4 4"/><path d="M5 12h9.5a4.5 4.5 0 0 1 0 9H12"/>',
    warn:   '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.5v4.5M12 17v.3"/>',
    shield: '<path d="M12 3 19.5 6v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z"/><path d="m8.8 12 2.3 2.3 4.2-4.3"/>',
    doc:    '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h7M9 14.5h7M9 18h4"/>',
    pledge: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9.5"/>',
    phone:  '<rect x="7" y="3" width="10" height="18" rx="2.2"/><path d="M11 17.8h2"/>',
    addhome:'<rect x="10" y="3" width="10" height="18" rx="2.2"/><path d="M3 12h9.5M9.5 9l3 3-3 3"/>',
    gear:   '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    chart:  '<path d="M4 20h16M7.5 20v-7M12 20V6M16.5 20v-4.5"/>',
    pin:    '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    swipe:  '<path d="M9.5 12.5V5.8a1.5 1.5 0 0 1 3 0v5.4"/><path d="M12.5 10.6a1.5 1.5 0 0 1 3 0v1.2M15.5 11.4a1.5 1.5 0 0 1 3 0v3.1c0 3.6-2.4 6.5-5.8 6.5h-.8c-2.2 0-3.5-1-4.7-3l-2-3.4a1.4 1.4 0 0 1 2.3-1.6l1.9 2"/><path d="M3 5h3.5M3 5l1.3-1.3M3 5l1.3 1.3M21 5h-3.5M21 5l-1.3-1.3M21 5l-1.3 1.3"/>',
    robot:  '<rect x="5" y="8" width="14" height="11" rx="2.6"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1.2"/><circle cx="9.5" cy="12.8" r="1.2"/><circle cx="14.5" cy="12.8" r="1.2"/><path d="M9.5 16.2h5M3 12v3.5M21 12v3.5"/>',
    burst:  '<path d="m12 2.5 1.8 5.6 5.4-2.6-2.6 5.4 5.6 1.8-5.6 1.8 2.6 5.4-5.4-2.6-1.8 5.6-1.8-5.6-5.4 2.6 2.6-5.4-5.6-1.8 5.6-1.8-2.6-5.4 5.4 2.6z"/>',
    walk:   '<circle cx="13" cy="4.3" r="1.6"/><path d="m12 7.8-1.8 5.8 3 3 1 4.4M10.2 13.6 7.5 21M11.6 9l3.4 2.5h2.5M11.6 9 8.4 11l-.8 2.8"/>',
    stop:   '<path d="M7.2 12.6V7a1.3 1.3 0 0 1 2.6 0v4.4M9.8 10.6V5a1.3 1.3 0 0 1 2.6 0v5.4M12.4 10.4V6a1.3 1.3 0 0 1 2.6 0v5M15 11V8.6a1.3 1.3 0 0 1 2.6 0v5.8c0 3.7-2.5 6.6-6 6.6h-.6c-2.4 0-3.8-1.2-5-3.4l-1.6-3a1.4 1.4 0 0 1 2.4-1.4l.4.6"/>',
    eye:    '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    flask:  '<path d="M9 3h6M10 3v6.2L5 18.6A1.6 1.6 0 0 0 6.4 21h11.2a1.6 1.6 0 0 0 1.4-2.4L14 9.2V3"/><path d="M7.4 15h9.2"/>',
    sparkle:'<path d="m11 3 1.6 5.4L18 10l-5.4 1.6L11 17l-1.6-5.4L4 10l5.4-1.6z"/><path d="M18.5 15.5v5M16 18h5"/>',
    printer:'<path d="M7 9V3.5h10V9"/><path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
    globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    star:   '<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
    table:  '<path d="M3 9.5h18M5 9.5v10M19 9.5v10M3 9.5 5 6h14l2 3.5M5 14h14"/>',
    heart:  '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  };
  // 絵文字 → アイコン
  const MAP = {
    "🏠": "home", "🎨": "brush", "🚃": "tram", "🚋": "tram", "🛤": "rails", "📷": "camera", "🎞": "film",
    "🗑": "trash", "✏": "pencil", "🧽": "eraser", "🔄": "reload", "↩": "undo", "⚠": "warn", "🛡": "shield",
    "📜": "doc", "🤝": "pledge", "📱": "phone", "📲": "addhome", "⚙": "gear", "📊": "chart", "📍": "pin",
    "👆": "swipe", "🤖": "robot", "💥": "burst", "🚶‍♀": "walk", "🚶": "walk", "✋": "stop", "👀": "eye",
    "🧪": "flask", "🎉": "sparkle", "🖨": "printer", "🌐": "globe", "⭐": "star", "♥": "heart", "🪑": "table",
  };
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const RE = new RegExp("(" + Object.keys(MAP).sort((a, b) => b.length - a.length).map(esc).join("|") + ")\\uFE0F?", "gu");
  const SKIP = "script,style,textarea,input,title,option,select,svg,canvas,noscript,[data-noicon]";

  const css = document.createElement("style");
  css.textContent = ".jic{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;flex:none;fill:none;stroke:currentColor;" +
    "stroke-width:2;stroke-linecap:round;stroke-linejoin:round;overflow:visible}";
  document.head.appendChild(css);

  function icon(name) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "jic"); s.setAttribute("aria-hidden", "true");
    s.innerHTML = ICONS[name];
    return s;
  }
  function fixText(t) {
    const v = t.nodeValue;
    if (!v || !RE.test(v)) return;
    RE.lastIndex = 0;
    const p = t.parentElement;
    if (!p || p.closest(SKIP)) return;
    const f = document.createDocumentFragment();
    let last = 0, m;
    while ((m = RE.exec(v))) {
      if (m.index > last) f.appendChild(document.createTextNode(v.slice(last, m.index)));
      f.appendChild(icon(MAP[m[1]]));
      last = m.index + m[0].length;
    }
    if (last < v.length) f.appendChild(document.createTextNode(v.slice(last)));
    t.parentNode.replaceChild(f, t);
  }
  function fix(root) {
    if (!root) return;
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(fixText);
  }
  new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === "characterData") fixText(m.target);
      else m.addedNodes.forEach(fix);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  if (document.body) fix(document.body);
  else document.addEventListener("DOMContentLoaded", () => fix(document.body));
  window.JatchuIcons = { ICONS, MAP, icon };
})();
