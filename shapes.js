/* =========================================================
   ジャッチュ「ゴーゴーランプ」の絵をかく（rail.html から使う）

     ・消えているランプ（真っ暗）
     ・光ったランプ
     ・写真に変わったランプ（ランプの形に写真を切り抜く）
     ・はじめの画面に出す見本
   ========================================================= */
(function () {
  const IMG = "gogo.png", ASPECT = 548 / 388;   // ランプの絵と、その 横÷縦
  const PAD = 0.1;                               // まわりの光の分の余白
  const INNER_H = 640;                           // ランプの部分の高さ [px]

  let imgP = null;
  const lampImage = () => imgP || (imgP = new Promise((ok) => {
    const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = IMG;
  }));

  function size() {
    const h = INNER_H, w = Math.round(h * ASPECT);
    return { w: Math.round(w * (1 + 2 * PAD)), h: Math.round(h * (1 + 2 * PAD)), iw: w, ih: h };
  }

  // ランプ（lit=false で真っ暗、true で光る）
  async function drawLamp(cv, lit) {
    const z = size(), img = await lampImage();
    cv.width = z.w; cv.height = z.h;
    const x = cv.getContext("2d"), bx = (z.w - z.iw) / 2, by = (z.h - z.ih) / 2;
    x.clearRect(0, 0, z.w, z.h);
    if (!img) return z;
    const t = document.createElement("canvas"); t.width = z.w; t.height = z.h;
    const tx = t.getContext("2d");
    tx.drawImage(img, bx, by, z.iw, z.ih);
    tx.globalCompositeOperation = "source-atop";
    if (lit) {
      tx.fillStyle = "rgba(255,255,230,.18)"; tx.fillRect(0, 0, z.w, z.h);
      x.save(); x.shadowColor = "rgba(255,225,60,1)"; x.shadowBlur = z.ih * 0.08;
      x.drawImage(t, 0, 0); x.drawImage(t, 0, 0); x.restore();
    } else {
      tx.fillStyle = "rgba(14,16,24,.86)"; tx.fillRect(0, 0, z.w, z.h);   // 電気が消えている
      x.drawImage(t, 0, 0);
    }
    return z;
  }

  // 写真に変わったランプ：ランプの形に写真を切り抜いて、まわりを光らせる
  async function drawPhotoLamp(cv, photo) {
    const z = size(), img = await lampImage();
    cv.width = z.w; cv.height = z.h;
    const x = cv.getContext("2d"), bx = (z.w - z.iw) / 2, by = (z.h - z.ih) / 2;
    x.clearRect(0, 0, z.w, z.h);
    if (!img) return z;
    const t = document.createElement("canvas"); t.width = z.w; t.height = z.h;
    const tx = t.getContext("2d");
    if (photo) {                                   // ランプの箱いっぱいに写真をしく
      const k = Math.max(z.iw / photo.naturalWidth, z.ih / photo.naturalHeight), w = photo.naturalWidth * k, h = photo.naturalHeight * k;
      tx.drawImage(photo, bx + (z.iw - w) / 2, by + (z.ih - h) / 2, w, h);
    } else {
      tx.fillStyle = "#1b2a4a"; tx.fillRect(bx, by, z.iw, z.ih);
      tx.fillStyle = "#fff"; tx.textAlign = "center"; tx.textBaseline = "middle"; tx.font = `bold ${z.ih * 0.11}px sans-serif`;
      tx.fillText("写真を", z.w / 2, z.h / 2 - z.ih * 0.07); tx.fillText("えらんでね", z.w / 2, z.h / 2 + z.ih * 0.07);
    }
    tx.globalCompositeOperation = "destination-in";   // ランプの形だけ残す
    tx.drawImage(img, bx, by, z.iw, z.ih);
    // 白いふち → 黄色い光
    const rim = document.createElement("canvas"); rim.width = z.w; rim.height = z.h;
    const rx = rim.getContext("2d");
    rx.drawImage(img, bx, by, z.iw, z.ih); rx.globalCompositeOperation = "source-in"; rx.fillStyle = "#fff"; rx.fillRect(0, 0, z.w, z.h);
    x.save(); x.shadowColor = "rgba(255,225,60,1)"; x.shadowBlur = z.ih * 0.08;
    x.drawImage(rim, 0, 0); x.drawImage(rim, 0, 0); x.restore();
    const sh = z.ih * 0.035;                       // 写真は少し小さくして、白いふちを見せる
    x.drawImage(t, sh * ASPECT, sh, z.w - 2 * sh * ASPECT, z.h - 2 * sh);
    return z;
  }

  // はじめの画面の見本：写真に変わったランプ
  const drawPreview = (cv, photo) => drawPhotoLamp(cv, photo);

  window.JatchuLamp = { ASPECT, PAD, size, drawLamp, drawPhotoLamp, drawPreview };
})();
