/* =========================================================
   ジャッチュ「変形ロボ」（rail.html から使う）

   電車の形で走ってきて、止まるとガシャガシャ変形してロボットになる。
   電車の体を、箱（部品）に切り分けておき、
   部品ごとに「電車のときの場所」と「ロボットのときの場所」を決めて、その間を動かす。
   体の横には「つくる」でデザインした電車の柄を貼るので、自分だけのロボットになる。

   大きさの単位は m。電車の向き：X＝線路ぞい（-X が前）、Y＝上、Z＝横
   ロボットは -X の方（前）を向いて立つ
   ========================================================= */
import * as THREE from 'three';

// 電車の体の範囲
const L = 12, X0 = -L / 2, Y0 = 0.35, Y1 = 3.2, ZW = 1.15, YM = 1.9;   // YM：窓の下（上下に分ける高さ）

/* 部品の一覧
   t: 電車のときにしめる範囲 [x0, x1, y0, y1, z0, z1]
   r: ロボットのときの [まん中 x, y, z]、s: 大きさ [x, y, z]、rot: 回転 [x, y, z]（度）
   d: 動き出すまでの遅れ（0〜1） */
const PARTS = [
  { n: 'head',   t: [-6, -5, YM, Y1, -ZW, ZW],    r: [0, 6.05, 0],      s: [1.0, 0.95, 1.05], d: 0.55 },
  { n: 'plate',  t: [-6, -5, Y0, YM, -ZW, ZW],    r: [-0.68, 4.55, 0],  s: [0.2, 1.1, 1.7],   d: 0.45 },
  { n: 'chest',  t: [-5, -2.5, Y0, Y1, -ZW, ZW],  r: [0, 4.75, 0],      s: [1.2, 1.8, 2.5],   d: 0.25 },
  { n: 'shL',    t: [-2.5, -1.5, YM, Y1, 0, ZW],  r: [0, 5.45, 1.7],    s: [1.1, 0.75, 0.95], d: 0.35 },
  { n: 'shR',    t: [-2.5, -1.5, YM, Y1, -ZW, 0], r: [0, 5.45, -1.7],   s: [1.1, 0.75, 0.95], d: 0.35 },
  { n: 'pelvis', t: [-2.5, -1.5, Y0, YM, -ZW, ZW], r: [0, 3.55, 0],     s: [0.95, 0.6, 1.9],  d: 0.15 },
  { n: 'armL',   t: [-1.5, 1.5, YM, Y1, 0, ZW],   r: [0, 4.15, 1.85],   s: [0.75, 2.2, 0.7],  d: 0.4, rot: [-8, 0, 0] },
  { n: 'armR',   t: [-1.5, 1.5, YM, Y1, -ZW, 0],  r: [0, 4.15, -1.85],  s: [0.75, 2.2, 0.7],  d: 0.4, rot: [8, 0, 0] },
  { n: 'fistL',  t: [1.5, 2.3, YM, Y1, 0, ZW],    r: [-0.05, 2.8, 2.0], s: [0.8, 0.6, 0.8],   d: 0.5 },
  { n: 'fistR',  t: [1.5, 2.3, YM, Y1, -ZW, 0],   r: [-0.05, 2.8, -2.0], s: [0.8, 0.6, 0.8],  d: 0.5 },
  { n: 'packL',  t: [2.3, 6, YM, Y1, 0, ZW],      r: [0.85, 5.1, 0.75], s: [0.5, 2.2, 1.3],   d: 0.3, rot: [-14, 0, 0] },
  { n: 'packR',  t: [2.3, 6, YM, Y1, -ZW, 0],     r: [0.85, 5.1, -0.75], s: [0.5, 2.2, 1.3],  d: 0.3, rot: [14, 0, 0] },
  { n: 'legL',   t: [-1.5, 4.5, Y0, YM, 0, ZW],   r: [0, 1.85, 0.62],   s: [0.9, 3.0, 0.85],  d: 0.0 },
  { n: 'legR',   t: [-1.5, 4.5, Y0, YM, -ZW, 0],  r: [0, 1.85, -0.62],  s: [0.9, 3.0, 0.85],  d: 0.0 },
  { n: 'footL',  t: [4.5, 6, Y0, YM, 0, ZW],      r: [-0.25, 0.22, 0.62], s: [1.45, 0.44, 1.0], d: 0.1 },
  { n: 'footR',  t: [4.5, 6, Y0, YM, -ZW, 0],     r: [-0.25, 0.22, -0.62], s: [1.45, 0.44, 1.0], d: 0.1 },
];
// 色だけの部品（車輪・パンタグラフ・目）
const EXTRAS = [
  { n: 'wheelF', t: [-4.4, -2.6, 0, Y0, -0.9, 0.9], r: [-0.5, 2.1, 0.62],  s: [0.25, 0.7, 0.95], d: 0.05, c: 'dark' },
  { n: 'wheelB', t: [2.6, 4.4, 0, Y0, -0.9, 0.9],   r: [-0.5, 2.1, -0.62], s: [0.25, 0.7, 0.95], d: 0.05, c: 'dark' },
  { n: 'panta',  t: [-0.6, 0.6, Y1, Y1 + 0.35, -0.5, 0.5], r: [0.1, 6.75, 0], s: [0.25, 0.5, 0.9], d: 0.6, c: 'metal' },
  { n: 'eyes',   t: [-5.2, -5.1, 2.6, 2.7, -0.1, 0.1], r: [-0.51, 6.12, 0], s: [0.06, 0.16, 0.75], d: 0.8, c: 'eye', hide: true },
];

// 電車の横の絵（デザイン）に、窓をかきたす
function sideCanvas(src) {
  const c = document.createElement('canvas'); c.width = 1536; c.height = 352;
  const g = c.getContext('2d'), w = c.width, h = c.height;
  if (src) g.drawImage(src, 0, 0, w, h);
  else { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#cfd6de'; g.fillRect(0, h * 0.52, w, h * 0.03); g.fillRect(0, h * 0.95, w, h * 0.05); }
  // 窓（上の方に並べる。前と後ろは運転台の大きな窓）
  const wy = h * 0.13, wh = h * 0.3;
  const win = (x, ww) => {
    g.fillStyle = 'rgba(20,32,52,.92)'; g.beginPath(); g.roundRect(x, wy, ww, wh, h * 0.03); g.fill();
    g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.roundRect(x + ww * 0.08, wy + wh * 0.1, ww * 0.25, wh * 0.8, h * 0.02); g.fill();
  };
  win(w * 0.015, w * 0.07);
  for (let i = 0; i < 7; i++) win(w * (0.12 + i * 0.105), w * 0.08);
  win(w * 0.915, w * 0.07);
  return c;
}

export function createRobot({ sideImage = null, c1 = '#ffffff', c2 = '#cfd6de' } = {}) {
  const group = new THREE.Group();
  const tex = new THREE.CanvasTexture(sideCanvas(sideImage)); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const side = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.05 });
  const body = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.55, metalness: 0.05 });
  const roof = new THREE.MeshStandardMaterial({ color: c2, roughness: 0.7, metalness: 0.1 });
  const colors = {
    dark: new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.8, metalness: 0.3 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.4, metalness: 0.6 }),
    eye: new THREE.MeshBasicMaterial({ color: 0x5ff4ff, toneMapped: false }),
  };
  const rad = THREE.MathUtils.degToRad;
  const parts = [];
  for (const p of [...PARTS, ...EXTRAS]) {
    const [x0, x1, y0, y1, z0, z1] = p.t;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    if (!p.c) {
      // 横の面（+Z と -Z）に、電車のときの場所に合わせて柄の一部を貼る
      const uv = geo.attributes.uv, v0 = (y0 - Y0) / (Y1 - Y0), v1 = (y1 - Y0) / (Y1 - Y0);
      const set = (face, u0, u1) => { for (let k = 0; k < 4; k++) { const i = face * 4 + k; uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0)); } };
      set(4, (x0 - X0) / L, (x1 - X0) / L);                 // +Z：前（-X）が左
      set(5, 1 - (x1 - X0) / L, 1 - (x0 - X0) / L);         // -Z：前が右
      uv.needsUpdate = true;
    }
    const m = new THREE.Mesh(geo, p.c ? colors[p.c] : [body, body, roof, colors.dark, side, side]);
    m.castShadow = true;
    const tram = { pos: new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), scale: new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0), quat: new THREE.Quaternion() };
    const r = p.rot || [0, 0, 0];
    const bot = { pos: new THREE.Vector3(...p.r), scale: new THREE.Vector3(...p.s), quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(r[0]), rad(r[1]), rad(r[2]))) };
    parts.push({ m, tram, bot, d: p.d, hide: !!p.hide, n: p.n });
    group.add(m);
  }
  const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const q = new THREE.Quaternion(), spin = new THREE.Quaternion(), ax = new THREE.Vector3(1, 0, 0);
  // k：0＝電車、1＝ロボット。部品ごとに少しずつずらして動かす
  function setK(k, now = 0) {
    for (const p of parts) {
      const span = 0.5, u = ease(Math.min(1, Math.max(0, (k - p.d * (1 - span)) / span)));
      p.m.position.lerpVectors(p.tram.pos, p.bot.pos, u);
      p.m.position.y += Math.sin(Math.PI * u) * 0.9;                    // ふわっと持ち上がってから はまる
      p.m.scale.lerpVectors(p.tram.scale, p.bot.scale, u);
      q.slerpQuaternions(p.tram.quat, p.bot.quat, u);
      spin.setFromAxisAngle(ax, Math.sin(Math.PI * u) * 1.2);           // 動いている間は くるっと回る
      p.m.quaternion.copy(q).multiply(spin);
      p.m.visible = !p.hide || u > 0.98;
    }
    // ロボットになったら、少し息をするように動く
    if (k >= 1) {
      const b = Math.sin(now / 1000 * 2.2) * 0.04;
      for (const p of parts) if (p.bot.pos.y > 3.3) p.m.position.y += b;
    }
  }
  setK(0);
  return { group, setK };
}
